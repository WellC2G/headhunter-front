import { atom, useAtom } from 'jotai';
import axios from 'axios';
import '../styles/modal.css'
import {showModalCreateCompanyAtom} from "../atoms/atoms.tsx";
import {useNavigate} from "react-router-dom";

const nameCompanyAtom = atom('');
const descriptionCompanyAtom = atom('');
const modalLoadingAtom = atom(false);
const modalErrorAtom = atom<string | null>(null);

const CreateCompanyModal: React.FC = () => {
    const [showModal, setShowModal] = useAtom(showModalCreateCompanyAtom);
    const [name, setName] = useAtom(nameCompanyAtom);
    const [description, setDescription] = useAtom(descriptionCompanyAtom);
    const [loading, setLoading] = useAtom(modalLoadingAtom);
    const [error, setError] = useAtom(modalErrorAtom);
    const navigate = useNavigate();

    const handleCreateCompany = async (e: any) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            const CompanyData = {name, description};
            const token = localStorage.getItem("token");
            const response = await axios.post("http://localhost:3000/company/create", CompanyData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            setShowModal(false);
            setName('');
            setDescription('');

            const companyId = response.data.companyId;

            localStorage.setItem("companyId", companyId);

            navigate(`/company/${companyId}`);
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
                <h2 className={"modal-h2"}>Создать компанию</h2>
                {error && <p style={{color: 'red'}}>{error}</p>}
                <form onSubmit={handleCreateCompany} className="modal-form">
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
                    <button className={"modal-button"} disabled={loading}>
                        {loading ? 'Создание...' : 'Создать'}
                    </button>
                </form>
            </div>
        </div>
    );
}
export default CreateCompanyModal;