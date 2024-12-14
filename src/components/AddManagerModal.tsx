import {atom, useAtom} from 'jotai';
import '../styles/modal.css'
import {showModalManagerAddAtom} from "../atoms/atoms.tsx";

const companyId = localStorage.getItem("companyId");
const copySuccessAtom = atom<string>('')
const linkAtom = atom<string>(`http://localhost:5000/company/managers/add/${companyId}`)

const ManagerAddModal: React.FC = () => {
    const [, setShowModal] = useAtom(showModalManagerAddAtom);
    const [link] = useAtom(linkAtom);
    const [copySuccess, setCopySuccess] = useAtom(copySuccessAtom);

    const copyToClipboard = () => {
        navigator.clipboard.writeText(link)
            .then(() => {
                setCopySuccess('Ссылка скопирована!');
                setTimeout(() => {
                    setCopySuccess('');
                }, 2000);
            })
            .catch((error) => {
                setCopySuccess('Ошибка при копировании!');
                console.error('Ошибка при копировании:', error);
            });
    }

    return (
        <div className="modal">
            <div className="modal-content">
                <span className="close" onClick={() => setShowModal(false)}>&times;</span>
                <h2 className={"modal-h2"}>Добавить менеджера</h2>
                <p>Скопируйте ссылку и отправьте ее пользователю, чтобы добавить менеджера</p>
                <div>
                    <input type="text" value={link} readOnly className="modal-input" />
                    <button onClick={copyToClipboard} className={"modal-button"}>Скопировать</button>
                    {copySuccess && <div>{copySuccess}</div>}
                </div>
            </div>
        </div>
    );
}
export default ManagerAddModal;