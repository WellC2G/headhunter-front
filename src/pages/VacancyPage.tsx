import React, {useEffect} from "react";
import Header from "../components/Header.tsx";
import axios from "axios";
import {atom, useAtom} from "jotai";
import "../styles/VacancyPage.css"
import CreateVacancyModal from "../components/CreateVacancyModal.tsx";
import {showModalCreateVacancyAtom, showModalEditVacancyAtom} from "../atoms/atoms.tsx";
import EditVacancyModal from "../components/EditVacancyModal.tsx";

interface Vacancy {
    id: number;
    title: string;
    salary: string;
    description: string;
}


const errorAtom = atom<string | null>(null);
const vacanciesAtom = atom<Vacancy[]>([]);
const selectedVacancyIdAtom = atom<number | null>(null);

const VacancyPage: React.FC = () => {

    const [, setShowModal] = useAtom(showModalCreateVacancyAtom);
    const [, setShowModalEdit] = useAtom(showModalEditVacancyAtom);
    const [error, setError] = useAtom(errorAtom);
    const [vacancies, setVacancies] = useAtom(vacanciesAtom);

    const [selectedVacancyId, setSelectedVacancyId] = useAtom(selectedVacancyIdAtom);
    const companyId = localStorage.getItem("companyId");


    useEffect(() => {
        const fethData = async () => {
            try {
                const token = localStorage.getItem("token");
                await axios.get("http://localhost:3000/user/check-auth", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                });

                const responseVacancy = await axios.get(`http://localhost:3000/vacancy/vacancies/${companyId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                });

                setVacancies(responseVacancy.data);

            } catch (err: any) {
                setError(err.response?.data?.error || "An error occurred");
            }
        };
        fethData();
    }, []);

    const handleDeleteVacancy = async (vacancyId: number) => {
        try {
            const token = localStorage.getItem("token");
            await axios.delete(`http://localhost:3000/vacancy/${vacancyId}/delete/${companyId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setVacancies(vacancies.filter(vacancy => vacancy.id !== vacancyId));

        } catch (err: any) {
            setError(err.response?.data?.message || "Ошибка при удалении менеджера");
        }
    };

    return (
        <><Header />
            <div className="vacancyPage">
                {error && <p style={{color: 'red'}}>{error}</p>}
                {companyId !== null && companyId !== undefined ? (
                    <>
                        <div className="button-container">
                            <button onClick={() => setShowModal(true)} className={"vacancyPage-button"}>
                                Создать вакансию
                            </button>
                        </div>
                        <div>
                            <h2>Вакансии</h2>
                            <div>
                            {vacancies.map((vacancy) => (
                                <div key={vacancy.id} className="vacancy-item">
                                    <div className="vacancy-info">
                                        <h3>{vacancy.title}</h3>
                                        <p>{vacancy.salary}</p>
                                    </div>
                                    <button onClick={() => {setShowModalEdit(true);
                                        setSelectedVacancyId(vacancy.id);}}
                                            className={"vacancyPage-button"}>
                                        Редактировать вакансию
                                    </button>
                                    <span className="vacancy-button-delete"
                                          onClick={() => handleDeleteVacancy(vacancy.id)}>&times;</span>
                                </div>
                            ))}
                            </div>
                        </div>
                        <EditVacancyModal vacancyId={selectedVacancyId}/>
                        <CreateVacancyModal/>
                    </>
                ) : (
                    <p>Вы не принадлежите ни одной компании</p>
                )}
            </div>
        </>)
};

export default VacancyPage;