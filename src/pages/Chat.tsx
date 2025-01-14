import React, {useEffect} from "react";
import Header from "../components/Header.tsx";
import "../styles/Chat.css"
import {atom, useAtom} from "jotai";
import {useParams} from "react-router-dom";
import axios from "axios";

interface Chat {
    id: number;
    members: Members[];
}

export interface Members {
    id: number;
    userId: number | null;
    companyId: number | null;
}

export interface Message {
    id: number;
    createdAt: string;
    updatedAt: string;
    chatId: number;
    chatMemberId: number;
    content: string;
}

const errorAtom = atom<string | null>(null);
const loadingAtom = atom<boolean>(false);
const chatAtom = atom<Chat | null>(null);
const messagesAtom = atom<Message[]>([]);
const newMessageAtom = atom<string>('');

const Chat: React.FC = () => {

    const [error, setError] = useAtom(errorAtom);
    const [loading, setLoading] = useAtom(loadingAtom);
    const [, setChat] = useAtom(chatAtom);
    const [messages, setMessages] = useAtom(messagesAtom);
    const [newMessage, setNewMessage] = useAtom(newMessageAtom);

    const companyId = useParams().id;

    useEffect(() => {
        const fethData = async () => {
            try {
                const token = localStorage.getItem("token");
                await axios.get("http://localhost:3000/user/check-auth", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                });

                const response = await axios.get(`http://localhost:3000/chat/companyId/${companyId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                });

                setChat(response.data);

                if (response.data) {
                    const getMessages = await axios.get(`http://localhost:3000/chat/messages/${response.data.id}`, {headers: {
                            Authorization: `Bearer ${token}`,
                        }
                    });
                    setMessages(getMessages.data);
                }

            } catch (err: any) {
                setError(err.response?.data?.error || "An error occurred");
            }
        };
        fethData();
    }, []);

    const handleSendMessage = async (e: any) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            const token = localStorage.getItem("token");
            const data = {content: newMessage, targetId: companyId};
            await axios.post(`http://localhost:3000/chat/send/user`, data , {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setNewMessage('');

        } catch (err: any) {
            setError(err.response?.data?.error || "An error occurred");
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            <Header />
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {loading && <p>Loading...</p>}

            <div className="chat-container">
                <div className="messages-list">
                    {messages.map((message) => (
                        <div key={message.id} className="message">
                            <p>{message.content}</p>
                            <small>{new Date(message.createdAt).toLocaleString()}</small>
                        </div>
                    ))}
                </div>

                <form onSubmit={handleSendMessage} className="message-form">
                    <input
                        type="text"
                        name="message"
                        placeholder="Введите сообщение"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                    />
                    <button type="submit" disabled={loading}>
                        Отправить
                    </button>
                </form>
            </div>
        </>
    );
};

export default Chat;