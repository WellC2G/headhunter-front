import { atom, useAtom } from 'jotai';
import axios from 'axios';
import '../styles/modal.css'
import {showModalEditCompanyAtom} from "../atoms/atoms.tsx";
import React, {useEffect} from "react";
import {useNavigate} from "react-router-dom";

const nameCompanyAtom = atom('');
const descriptionCompanyAtom = atom('');
const modalLoadingAtom = atom(false);
const avatarUrlCompanyAtom = atom<string | null>(null);
const fileCompanyAtom = atom<File | null>(null);
const modalErrorAtom = atom<string | null>(null);

const CreateCompanyModal: React.FC = () => {
    const [showModal, setShowModal] = useAtom(showModalEditCompanyAtom);
    const [name, setName] = useAtom(nameCompanyAtom);
    const [description, setDescription] = useAtom(descriptionCompanyAtom);
    const [file, setFile] = useAtom(fileCompanyAtom);
    const [avatarUrl, setAvatarUrl] = useAtom(avatarUrlCompanyAtom);
    const [loading, setLoading] = useAtom(modalLoadingAtom);
    const [error, setError] = useAtom(modalErrorAtom);
    const companyId = localStorage.getItem('companyId');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await axios.get(`http://localhost:3000/company/get-company/${companyId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setName(response.data.name);
                setDescription(response.data.description);
                setAvatarUrl(response.data.avatar);

            } catch (err: any) {
                setError(err.response?.data?.error || "An error occurred");
            }
        };
        fetchData();
    }, []);

    const handleEditCompany = async (e: any) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            const CompanyData = {name, description};
            const token = localStorage.getItem("token");
            await axios.put(`http://localhost:3000/company/edit/${companyId}`, CompanyData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            setShowModal(false);
            navigate(0);
        } catch (err: any) {
            setError(err.response?.data?.error || "An error occurred");
        } finally {
            setLoading(false);
        }
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
                await axios.post(`http://localhost:3000/company/upload/${companyId}`, formData, {
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

    if (!showModal) {
        return null;
    }

    return (
        <div className="modal">
            <div className="modal-content">
                <span className="close" onClick={() => setShowModal(false)}>&times;</span>
                <h2 className={"modal-h2"}>Редактировать компанию</h2>
                {error && <p style={{color: 'red'}}>{error}</p>}
                <form onSubmit={handleEditCompany} className="modal-form">
                    <div>
                        <div className="avatar-upload-container">
                            <label htmlFor="avatar-upload" className="avatar-upload-label">
                                <div className="avatar-preview">
                                    {file ? (
                                        <img src={URL.createObjectURL(file)} alt="Avatar preview"
                                             className="avatar-preview-image"/>
                                    ) : avatarUrl ? (
                                        <img src={avatarUrl} alt="Avatar" className="avatar-preview-image"/>
                                    ) :  (
                                        <div className="avatar-placeholder"></div>
                                    )}
                                </div>
                                <input type="file" id="avatar-upload" onChange={handleFileChange}
                                       className="avatar-upload-input"/>
                            </label>
                        </div>
                    </div>
                    <div>
                        <label htmlFor="name" className={"modal-label"}>Название компании:</label>
                        <input
                            className={"modal-input"}
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="description" className={"modal-label-description"}>Описание:</label>
                        <textarea
                            className={"modal-input-description"}
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                        />
                    </div>
                    <button onClick={handleFileUpload} className={"modal-button"} disabled={loading}>
                        {loading ? 'Редактирование...' : 'Обновить'}
                    </button>
                </form>
            </div>
        </div>
    );
}
export default CreateCompanyModal;