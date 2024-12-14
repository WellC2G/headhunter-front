import React, {useEffect} from "react";
import axios from "axios";
import {useNavigate} from "react-router-dom";
import "../styles/userPage.css"
import Header from "../components/Header.tsx";
import {atom, useAtom} from "jotai";


const firstNameAtom = atom("");
const lastNameAtom = atom("");
const descriptionUserAtom = atom("");
const emailAtom = atom("");
const avatarUrlAtom = atom<string | null>(null);
const fileAtom = atom<File | null>(null);
const loadingAtom = atom(false);
const errorAtom = atom<string | null>(null);

const UserProfilePage: React.FC = () => {
    const [firstName, setFirstName] = useAtom(firstNameAtom);
    const [lastName, setLastName] = useAtom(lastNameAtom);
    const [description, setDescription] = useAtom(descriptionUserAtom);
    const [email, setEmail] = useAtom(emailAtom);
    const [avatarUrl, setAvatarUrl] = useAtom(avatarUrlAtom);
    const [file, setFile] = useAtom(fileAtom);
    const [loading, setLoading] = useAtom(loadingAtom);
    const [error, setError] = useAtom(errorAtom);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await axios.get("http://localhost:3000/user/check-auth", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setFirstName(response.data.firstName);
                setLastName(response.data.lastName);
                setDescription(response.data.description);
                setEmail(response.data.email.email);
                setAvatarUrl(response.data.avatar);
            } catch (err: any) {
                setError(err.response?.data?.error || "An error occurred");
            }
        };
        fetchData();
    }, []);

    const handleUser = async (e: any): Promise<void> => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            const token = localStorage.getItem("token");

            const userData = {
                firstName: firstName,
                lastName: lastName,
                description: description,
                email: email,
            };

            await axios.put("http://localhost:3000/user/profile", userData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });
        } catch (err: any) {
            setError(err.response?.data?.error || "An error occurred");
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async (): Promise<void> => {
        localStorage.removeItem("token");
        localStorage.removeItem("companyId");
        sessionStorage.removeItem("user");

        navigate("/");
    };

    const handleFileChange = async (e: any): Promise<void> => {
        const file = e.currentTarget.files[0];
        const allowedTypes = ["image/jpeg", "image/png", "image/gif"];

        if (file && allowedTypes.includes(file.type)) {
            setFile(file);
        } else {
            setError("Пожалуйста, выберите файл изображения (JPEG, PNG, GIF).");
            setFile(null);
        }
    };

    const handleFileUpload = async (): Promise<void> => {
        if (file) {
            const formData = new FormData();
            formData.append("avatar", file);

            const token = localStorage.getItem("token");
            try {
                await axios.post("http://localhost:3000/user/upload", formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        Authorization: `Bearer ${token}`,
                    },
                });
            } catch (err: any) {
                setError(err.response?.data?.error || "An error occurred");
            }
        } else {
            setError("Пожалуйста, выберите файл");
        }
    };

    return (
        <><Header />
        <div className="userPage">
            {error && <p style={{color: 'red'}}>{error}</p>}
            {loading && <p style={{color: 'green'}}>Профиль успешно обновлен!</p>}
            <h1 className={"userPage-h1"}>Редактировать профиль</h1>
            <form onSubmit={handleUser}>
                <div>
                    <div className="avatar-upload-container">
                        <label htmlFor="avatar-upload" className="avatar-upload-label">
                            <div className="avatar-preview">
                                {file ? (
                                    <img src={URL.createObjectURL(file)} alt="Avatar preview"
                                         className="avatar-preview-image"/>
                                ) : avatarUrl ? (
                                    <img src={avatarUrl} alt="Avatar" className="avatar-preview-image"/>
                                ) : (
                                    <div className="avatar-placeholder"></div>
                                )}
                            </div>
                            <input type="file" id="avatar-upload" onChange={handleFileChange}
                                   className="avatar-upload-input"/>
                        </label>
                    </div>
                </div>
                <div className="name-container">
                    <div>
                        <label className={"userPage-label"} htmlFor="firstName">Имя:</label>
                        <input
                            className={"userPage-input"}
                            type="text"
                            id="firstName"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label className={"userPage-label"} htmlFor="lastName">Фамилия:</label>
                        <input
                            className={"userPage-input"}
                            type="text"
                            id="lastName"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            required
                        />
                    </div>
                </div>
                <div>
                    <label className={"userPage-label-description"} htmlFor="description">Описание:</label>
                    <textarea
                        className={"userPage-input-description"}
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label className={"userPage-label"} htmlFor="email">Email:</label>
                    <input
                        className={"userPage-input"}
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                    <div className={"button-container"}>
                    <button onClick={handleFileUpload} className={"userPage-button"} type="submit" disabled={loading}>
                        {loading ? "Обновление..." : "Обновить"}
                    </button>
                    <button onClick={handleLogout} className={"userPage-button-delete"}>Выйти
                    </button>
                </div>
            </form>
        </div>
        </>
    )
}

export default UserProfilePage;