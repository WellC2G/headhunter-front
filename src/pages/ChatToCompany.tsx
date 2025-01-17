import React, {useEffect, useMemo, useState} from "react";
import Header from "../components/Header.tsx";
import "../styles/Chat.css"
import {atom, useAtom} from "jotai";
import {useParams} from "react-router-dom";
import axios from "axios";
import {useSocket} from "../components/UseInitSocket.tsx";

interface ChatToCompany {
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
const chatAtom = atom<ChatToCompany | null>(null);
const messagesAtom = atom<Message[]>([]);
const newMessageAtom = atom<string>('');
const userIdAtom = atom<number | null>(null);

const Chat: React.FC = () => {

    const [error, setError] = useAtom(errorAtom);
    const [loading, setLoading] = useAtom(loadingAtom);
    const [chat, setChat] = useAtom(chatAtom);
    const [userId, setUserId] = useAtom(userIdAtom);
    const [messages, setMessages] = useAtom(messagesAtom);
    const [newMessage, setNewMessage] = useAtom(newMessageAtom);
    const socket = useSocket();
    const [socketMsgs, setSocketMsgs] = useState<Message[]>([]);

    const companyId = useParams().id;

    const messagesData = useMemo(() => {

        const sortMsgs = [...socketMsgs].sort((a, b) =>  - new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

        if (!messages) return [...sortMsgs];

        return [...sortMsgs, ...messages]
    }, [messages, socketMsgs]);

    useEffect(() => {
        const fethData = async () => {
            try {
                const token = localStorage.getItem("token");
                const auth = await axios.get("http://localhost:3000/user/check-auth", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                });

                setUserId(auth.data.id);

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

    const isMyMessage = (message: Message): boolean => {
        if (!chat) return false;

        const member = chat.members.find(
            (member) => member.id.toString() === message.chatMemberId.toString(),
        );

        return member?.userId === userId;
    };

   useEffect(() => {
        if (socket) {
            socket.on('newMessage', (dto: {chat: ChatToCompany, message: Message}) => {
                if (dto.chat.id !== chat?.id) return;

                setSocketMsgs((prevMessages) => [...prevMessages, dto.message]);
            });
        }

        return () => {
            if (socket) {
                socket.off('newMessage');
            }
        };
    }, [socket, setSocketMsgs, chat]);

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
            setLoading(false);

        } catch (err: any) {
            setError(err.response?.data?.error || "An error occurred");
        }
    }

    return (
        <>
            <Header />
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {loading && <p>Loading...</p>}

            <div className="chat-container">
                <div className="messages-list">
                    {messagesData.map((message) => (
                        <div key={message.id}
                             className={`message ${isMyMessage(message) ? 'my-message' : 'other-message'}`}>
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