import { atom, useAtom } from 'jotai';
import axios from 'axios';
import '../styles/modal.css'
import {showModalCreateResumeAtom} from "../atoms/atoms.tsx";
import React from "react";
import Tiptap from "../editor/Tiptap.tsx";


const titleResumeAtom = atom('');
const descriptionResumeAtom = atom('');
const modalLoadingAtom = atom(false);
const modalErrorAtom = atom<string | null>(null);

const CreateResumeModal: React.FC = () => {
    const [showModal, setShowModal] = useAtom(showModalCreateResumeAtom);
    const [title, setTitle] = useAtom(titleResumeAtom);
    const [description, setDescription] = useAtom(descriptionResumeAtom);
    const [loading, setLoading] = useAtom(modalLoadingAtom);
    const [error, setError] = useAtom(modalErrorAtom);

    const handleCreateResume = async (e: any) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            const ResumeData = {title, description};
            const token = localStorage.getItem("token");
            await axios.post(`http://localhost:3000/resume/create`, ResumeData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            setShowModal(false);
            setTitle('');
            setDescription('');

            window.location.reload()

        } catch (err: any) {
            setError(err.response?.data?.error || "An error occurred");
        } finally {
            setLoading(false);
        }
    };

    if (!showModal) {
        return null;
    }

    return (
        <div className="modal">
            <div className="modal-content">
                <span className="close" onClick={() => setShowModal(false)}>&times;</span>
                <h2 className={"modal-h2"}>Создать резюме</h2>
                {error && <p style={{color: 'red'}}>{error}</p>}
                <form onSubmit={handleCreateResume} className="modal-form">
                    <div>
                        <label htmlFor="name" className={"modal-label"}>Название резюме:</label>
                        <input
                            className={"modal-input"}
                            type="text"
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="description" className={"modal-label-description"}>Описание:</label>
                        <Tiptap initialContent={description} getEditorContent={setDescription} />
                    </div>
                    <button className={"modal-button"} disabled={loading}>
                        {loading ? 'Создание...' : 'Создать'}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default CreateResumeModal;