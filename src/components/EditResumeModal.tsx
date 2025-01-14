import { atom, useAtom } from 'jotai';
import axios from 'axios';
import '../styles/modal.css'
import {showModalEditResumeAtom} from "../atoms/atoms.tsx";
import {useEffect} from "react";
import Tiptap from "../editor/Tiptap.tsx";

interface EditResumeModalProps {
    resumeId: number | null;
}

const titleResumeAtom = atom('');
const descriptionResumeAtom = atom<string>('');
const modalLoadingAtom = atom(false);
const modalErrorAtom = atom<string | null>(null);

const EditResumeModal: React.FC<EditResumeModalProps> = ({resumeId}) => {
    const [showModal, setShowModal] = useAtom(showModalEditResumeAtom);
    const [title, setTitle] = useAtom(titleResumeAtom);
    const [description, setDescription] = useAtom(descriptionResumeAtom);
    const [loading, setLoading] = useAtom(modalLoadingAtom);
    const [error, setError] = useAtom(modalErrorAtom);

    useEffect(() => {
        const fetchData = async () => {
            if (!resumeId) return;
            try {
                const token = localStorage.getItem("token");
                const responseVacancy = await axios.get(`http://localhost:3000/resume/info/${resumeId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                });

                setTitle(responseVacancy.data.title);
                setDescription(responseVacancy.data.description);

            } catch (err: any) {
                setError(err.response?.data?.error || "An error occurred");
            }
        };
        fetchData();
    }, [resumeId]);


    const handleEditResume = async (e: any) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        if (!resumeId) {
            setError("Resume ID is not defined");
            setLoading(false);
            return;
        }

        try {
            const VacancyData = {title, description};
            const token = localStorage.getItem("token");
            await axios.put(`http://localhost:3000/resume/edit/${resumeId}`, VacancyData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            setShowModal(false);
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

    const handleDisable = async () => {
        setShowModal(false);
        window.location.reload();
    }

    return (
        <div className="modal">
            <div className="modal-content">
                <span className="close" onClick={() => handleDisable()}>&times;</span>
                <h2 className={"modal-h2"}>Редактировать резюме</h2>
                {error && <p style={{color: 'red'}}>{error}</p>}
                <form onSubmit={handleEditResume} className="modal-form">
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
                        {description !== '' && (
                            <Tiptap initialContent={description} getEditorContent={setDescription}/>
                        )}
                    </div>
                    <button className={"modal-button"} disabled={loading}>
                        {loading ? 'Обновление...' : 'Обновить'}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default EditResumeModal;