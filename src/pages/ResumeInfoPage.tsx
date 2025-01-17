import React, {useEffect} from "react";
import Header from "../components/Header.tsx";
import axios from "axios";
import {atom, useAtom} from "jotai";
import {Link, useParams} from "react-router-dom";
import '../styles/ResumeInfoPage.css';

const titleAtom = atom("");
const descriptionAtom = atom<string>("");
const errorAtom = atom<string | null>(null);

const nameUserAtom = atom<string>("");
const lastNameUserAtom = atom<string>("");
const descriptionUserAtom = atom<string>("");
const avatarAtom = atom<string>("");
const userIdAtom = atom<number | null>(null);

const ResumeInfoPage: React.FC = () => {

    const [title, setTitle] = useAtom(titleAtom);
    const [description, setDescription] = useAtom(descriptionAtom);
    const [name, setName] = useAtom(nameUserAtom);
    const [lastname, setLastName] = useAtom(lastNameUserAtom);
    const [descriptionUser, setDescriptionUser] = useAtom(descriptionUserAtom);
    const [avatarUrl, setAvatarUrl] = useAtom(avatarAtom);
    const [error, setError] = useAtom(errorAtom);

    const [userId, setUserId] = useAtom(userIdAtom);

    const {resumeId} = useParams();

    useEffect(() => {
        const fethData = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await axios.get(`http://localhost:3000/resume/${resumeId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                setTitle(response.data.title);
                setName(response.data.user.firstName);
                setLastName(response.data.user.lastName);
                setDescriptionUser(response.data.user.description);
                setAvatarUrl("http://localhost:3000/" + response.data.user.avatar);
                setDescription(response.data.description);

                setUserId(response.data.user.id);

            } catch (err: any) {
                setError(err.response?.data?.message || "An error occurred");
            }
        };
        fethData();
    }, [])

    return (
        <><Header />
            {error && <p style={{color: 'red'}}>{error}</p>}
            <div className="resumeInfoPage">
                <div className="resumeInfoPage-details">
                    <h3 className={"resumeInfoPage-h3 resumeInfoPage-header"}>Резюме</h3>
                    <div>
                        <p className={"resumeInfoPage-p resumeInfoPage-title"}>{title}</p>
                    </div>
                    <div className="resumeInfoPage-description-block">
                        <label htmlFor="name" className={"resumeInfoPage-label"}>Описание
                            вакансии:</label>
                        <div className="resumeInfoPage-description"
                             dangerouslySetInnerHTML={{__html: description}}/>
                    </div>
                    <Link to={`/chat-to-user/${userId}`} className={"resumeInfoPage-button"}>Чат</Link>
                </div>
                <div className="resumeInfoPage-user-info">
                    <h3 className={"resumeInfoPage-h3 resumeInfoPage-user-title"}>Пользователь</h3>
                    <div className="resumeInfoPage-user-content">
                        <div className="resumeInfoPage-avatar">
                            <div className="avatar-preview">
                                {avatarUrl ? (
                                    <img src={avatarUrl} alt="Avatar" className="avatar-preview-image"/>
                                ) : (
                                    <div className="avatar-placeholder"></div>
                                )}
                            </div>
                        </div>
                        <div className="resumeInfoPage-user-name">
                            <p className={"resumeInfoPage-p"}>{name} {lastname}</p>
                        </div>
                    </div>
                    <p className={"resumeInfoPage-p resumeInfoPage-user-description"}>{descriptionUser}</p>
                </div>
            </div>
        </>)
};

export default ResumeInfoPage;