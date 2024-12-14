import { atom, useAtom } from 'jotai';
import axios from 'axios';
import '../styles/modal.css'
import {showModalCreateVacancyAtom} from "../atoms/atoms.tsx";
import Editor from "./Editor.tsx";


const titleVacancyAtom = atom('');
const salaryVacancyAtom = atom('');
const descriptionVacancyAtom = atom('');
const modalLoadingAtom = atom(false);
const modalErrorAtom = atom<string | null>(null);

const CreateVacancyModal: React.FC = () => {
    const [showModal, setShowModal] = useAtom(showModalCreateVacancyAtom);
    const [title, setTitle] = useAtom(titleVacancyAtom);
    const [salary, setSalary] = useAtom(salaryVacancyAtom);
    const [description, setDescription] = useAtom(descriptionVacancyAtom);
    const [loading, setLoading] = useAtom(modalLoadingAtom);
    const [error, setError] = useAtom(modalErrorAtom);


    const companyId = localStorage.getItem('companyId');

    const updateDescription = (data: any) => {
        setDescription(data);
    };

    const handleCreateVacancy = async (e: any) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {

            const VacancyData = {title, salary, description};
            const token = localStorage.getItem("token");
            await axios.post(`http://localhost:3000/vacancy/create/${companyId}`, VacancyData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            setShowModal(false);
            setTitle('');
            setSalary('');
            setDescription('');

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
                <h2 className={"modal-h2"}>Создать вакансию</h2>
                {error && <p style={{color: 'red'}}>{error}</p>}
                <form onSubmit={handleCreateVacancy} className="modal-form">
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
                        <Editor updateDescription={updateDescription} initialData={description} />
                    </div>
                    <button className={"modal-button"} disabled={loading}>
                        {loading ? 'Создание...' : 'Создать'}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default CreateVacancyModal;