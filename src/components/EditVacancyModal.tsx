import { atom, useAtom } from 'jotai';
import axios from 'axios';
import '../styles/modal.css'
import {showModalEditVacancyAtom} from "../atoms/atoms.tsx";
import {useEffect} from "react";
import Tiptap from "../editor/Tiptap.tsx";

interface EditVacancyModalProps {
    vacancyId: number | null;
}

const titleVacancyAtom = atom('');
const salaryVacancyAtom = atom('');
const descriptionVacancyAtom = atom<string>('');
const modalLoadingAtom = atom(false);
const modalErrorAtom = atom<string | null>(null);

const EditVacancyModal: React.FC<EditVacancyModalProps> = ({vacancyId}) => {
    const [showModal, setShowModal] = useAtom(showModalEditVacancyAtom);
    const [title, setTitle] = useAtom(titleVacancyAtom);
    const [salary, setSalary] = useAtom(salaryVacancyAtom);
    const [description, setDescription] = useAtom(descriptionVacancyAtom);
    const [loading, setLoading] = useAtom(modalLoadingAtom);
    const [error, setError] = useAtom(modalErrorAtom);

    useEffect(() => {
        const fetchData = async () => {
            if (!vacancyId) return;
            try {
                const token = localStorage.getItem("token");
                const responseVacancy = await axios.get(`http://localhost:3000/vacancy/${vacancyId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                });

                setTitle(responseVacancy.data.title);
                setSalary(responseVacancy.data.salary);
                setDescription(responseVacancy.data.description);

            } catch (err: any) {
                setError(err.response?.data?.error || "An error occurred");
            }
        };
        fetchData();
    }, [vacancyId]);


    const handleEditVacancy = async (e: any) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        if (!vacancyId) {
            setError("Vacancy ID is not defined");
            setLoading(false);
            return;
        }

        try {
            const VacancyData = {title, salary, description};
            const token = localStorage.getItem("token");
            await axios.put(`http://localhost:3000/vacancy/edit/${vacancyId}`, VacancyData, {
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
                <h2 className={"modal-h2"}>Редактировать вакансию</h2>
                {error && <p style={{color: 'red'}}>{error}</p>}
                <form onSubmit={handleEditVacancy} className="modal-form">
                    <div>
                        <label htmlFor="name" className={"modal-label"}>Название вакансии:</label>
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
                        <label htmlFor="salary" className={"modal-label"}>Зарплата:</label>
                        <input
                            className={"modal-input"}
                            type="text"
                            id="salary"
                            value={salary}
                            onChange={(e) => setSalary(e.target.value)}
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

export default EditVacancyModal;