import React, {useEffect} from "react";
import Header from "../components/Header.tsx";
import axios from "axios";
import {atom, useAtom} from "jotai";
import "../styles/ResponsesPage.css"
import {Link} from "react-router-dom";

interface Vacancy {
    id: number;
    title: string;
    salary: string;
    description: string;
    receivedResumes: Resume[];
}

interface Resume {
    id: number;
    title: string;
    user: User;
}

interface User {
    id: number;
}


const errorAtom = atom<string | null>(null);
const vacanciesAtom = atom<Vacancy[]>([]);

const ResponsePage: React.FC = () => {

    const [error, setError] = useAtom(errorAtom);
    const [vacancies, setVacancies] = useAtom(vacanciesAtom);

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

                const responseVacancy = await axios.get(`http://localhost:3000/vacancy/resumes/${companyId}`, {
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

    const handleDeleteResponses = async (vacancyId: number, resumeId: number) => {
        try {
            const token = localStorage.getItem("token");
            await axios.delete(`http://localhost:3000/response-to-vacancy/${resumeId}/delete/${vacancyId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setVacancies((prevVacancies) =>
                prevVacancies.map((vacancy) =>
                    vacancy.id === vacancyId
                        ? {
                            ...vacancy,
                            receivedResumes: vacancy.receivedResumes.filter(
                                (resume) => resume.id !== resumeId
                            ),
                        }
                        : vacancy
                )
            );

        } catch (err: any) {
            setError(err.response?.data?.message || "Ошибка при удалении связи");
        }
    };

    console.log(vacancies)

    return (
        <><Header />
            <div className="responsePage">
                {error && <p style={{color: 'red'}}>{error}</p>}
                {companyId !== null && companyId !== undefined ? (
                    <>
                        <div>
                            <h2>Отклики</h2>
                            <div>
                                {vacancies.map((vacancy) => (
                                    <div key={vacancy.id}>
                                        <div className="vacancy-item">
                                            <div className="vacancy-info">
                                                <h3>{vacancy.title}</h3>
                                                <p>{vacancy.salary}</p>
                                            </div>
                                        </div>
                                        <div className="resumes-block">
                                            {vacancy.receivedResumes.map((resume) => (
                                                <div key={resume.id} className="response-info">
                                                    <Link to={`/resume/${resume.id}`} className={"resume-link"}>
                                                        <h4>{resume.title}</h4>
                                                    </Link>
                                                    <Link to={`/chat-to-user/${resume.user.id}`} className={"resumeInfoPage-button"}>Чат</Link>
                                                    <span className="response-button-delete"
                                                          onClick={() => handleDeleteResponses(vacancy.id, resume.id)}>&times;</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </>
                ) : (
                    <p>Вы не принадлежите ни одной компании</p>
                )}
            </div>
        </>)
};

export default ResponsePage;