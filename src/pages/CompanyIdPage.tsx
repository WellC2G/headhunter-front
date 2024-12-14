import React, {useEffect} from "react";
import Header from "../components/Header.tsx";
import axios from "axios";
import {atom, useAtom} from "jotai";
import {showModalEditCompanyAtom, showModalManagerAddAtom} from "../atoms/atoms.tsx";
import "../styles/CompanyPage.css"
import EditCompanyModal from "../components/EditCompanyModal.tsx";
import ManagerAddModal from "../components/AddManagerModal.tsx";
import {Link} from "react-router-dom";

type Role = "generalManager" | "manager" | "applicant";

interface Manager {
    id: number;
    firstName: string;
    lastName: string;
    role: string;
    avatar: string;
}

const nameCompanyAtom = atom("");
const descriptionCompanyAtom = atom("");
const avatarUrlCompanyAtom = atom<string | null>(null);
const errorAtom = atom<string | null>(null);
const managersAtom = atom<Manager[]>([]);
const roleAtom = atom<string>("");

const CompanyIdPage: React.FC = () => {

    const [name, setName] = useAtom(nameCompanyAtom);
    const [role, setRole] = useAtom(roleAtom);
    const [managers, setManagers] = useAtom(managersAtom);
    const [description, setDescription] = useAtom(descriptionCompanyAtom);
    const [avatarUrl, setAvatarUrl] = useAtom(avatarUrlCompanyAtom);
    const [error, setError] = useAtom(errorAtom);
    const [, setShowModal] = useAtom(showModalEditCompanyAtom);
    const [showModalManager, setShowModalManager] = useAtom(showModalManagerAddAtom);

    const companyId = localStorage.getItem("companyId");


    useEffect(() => {
        const fethData = async () => {
            try {
                const token = localStorage.getItem("token");
                const responseUser =  await axios.get("http://localhost:3000/user/check-auth", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                });
                setRole(responseUser.data.role);

                const responseCompany = await axios.get(`http://localhost:3000/company/get-company/${companyId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setName(responseCompany.data.name);
                setDescription(responseCompany.data.description);
                setAvatarUrl(responseCompany.data.avatar);

                const responseManagers = await axios.get(`http://localhost:3000/company/managers/${companyId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })

                setManagers(responseManagers.data.managers.sort((a: Manager, b: Manager) => {
                    const roleOrder: Record<Role, number> = {
                        "generalManager": 3,
                        "manager": 2,
                        "applicant": 1
                    };

                    const roleA = roleOrder[a.role as Role] || 0;
                    const roleB = roleOrder[b.role as Role] || 0;

                    return roleB - roleA;
                }));


            } catch (err: any) {
                setError(err.response?.data?.error || "An error occurred");
            }
        };
        fethData();
    }, [])

    const handleDeleteManager = async (managerId: number) => {
        try {
            const token = localStorage.getItem("token");
            await axios.delete(`http://localhost:3000/company/managers/${managerId}/delete/${companyId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setManagers(managers.filter(manager => manager.id !== managerId));

        } catch (err: any) {
            setError(err.response?.data?.message || "Ошибка при удалении менеджера");
        }
    };

    return (
        <><Header />
            <div className="companyPage">
                {error && <p style={{color: 'red'}}>{error}</p>}
                <div className="button-container">
                    {role == "generalManager" ? (
                        <button onClick={() => setShowModal(true)} className="companyPage-button">Редактировать компанию
                        </button>
                    ) : null}
                    <Link to={"/vacancy"}>
                    <button className="companyPage-button">Вакансии
                    </button>
                    </Link>
                    <button className="companyPage-button">Отклики
                    </button>
                </div>
                <div className="companyPage-content">
                    <div className="companyPage-company-info">
                    <div className="companyPage-avatar">
                        <div className="avatar-upload-container">
                            <div className="avatar-preview">
                                {avatarUrl ? (
                                    <img src={avatarUrl} alt="Avatar" className="avatar-preview-image"/>
                                ) : (
                                    <div className="avatar-placeholder"></div>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="companyPage-details">
                        <div>
                            <label htmlFor="name" className={"companyPage-label"}>Название компании:</label>
                            <p className={"companyPage-p"}>{name}</p>
                        </div>
                        <div>
                            <label htmlFor="name" className={"companyPage-label"}>Описание
                                компании:</label>
                            <p className={"companyPage-p"}>{description}</p>
                        </div>
                    </div>
                </div>
                    <div className="companyPage-managers">
                        <h2>Менеджеры</h2>
                        <div>
                            {managers.map((manager) => (
                                <div key={manager.id} className="manager-item">
                                    <div className="avatar-preview">
                                        <img src={"http://localhost:3000/" + manager.avatar} alt="Avatar"
                                             className="avatar-preview-image"/>
                                    </div>
                                    <div className="manager-info">
                                        <h3>{manager.firstName} {manager.lastName}</h3>
                                        <p>{manager.role}</p>
                                    </div>
                                    {role == "generalManager" && manager.role !== "generalManager" ? (
                                        <span className="manager-button-delete" onClick={() => handleDeleteManager(manager.id)}>&times;</span>
                                    ): null}
                                </div>
                            ))}
                        </div>
                        <button onClick={() => setShowModalManager(true)} className="companyPage-button">+ Добавить менеджера
                        </button>
                    </div>
                </div>
                {showModalManager && <ManagerAddModal />}
                <EditCompanyModal/>
            </div>
        </>)
};

export default CompanyIdPage;