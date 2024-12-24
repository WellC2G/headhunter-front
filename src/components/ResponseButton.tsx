import React, {useEffect} from "react";
import axios from "axios";
import {atom, useAtom} from "jotai/index";
import "../styles/ResponseButton.css"
import {showModalSubmitResumeAtom, vacanciesUserAtom} from "../atoms/atoms.tsx";
import SubmitResumeModal from "./SubmitResumeModal.tsx";

interface ResponseButtonProps {
    vacancyId: string | number | undefined;
}

const buttonErrorAtom = atom<string | null>(null);

const ResponseButton: React.FC<ResponseButtonProps> = ({ vacancyId }) => {

    const [error, setError] = useAtom(buttonErrorAtom);
    const [userVacancies, setUserVacancies] = useAtom(vacanciesUserAtom);
    const [, setShowModal] = useAtom(showModalSubmitResumeAtom);

    const token = localStorage.getItem("token");

    if(typeof vacancyId === "string") {
        vacancyId = parseInt(vacancyId)
    }

    if(typeof vacancyId === undefined) {
        return null;
    }

    useEffect(() => {

        if (token === null) {
            return;
        }

        const fetchData = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/vacancy/home/user-vacancies`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                setUserVacancies(response.data);

            } catch (err: any) {
                setError(err.response?.data?.error || "An error occurred");
            }
        };
        fetchData();
    }, [token, vacancyId]);

    if (token === null) {
        return (
            <div>
                {error && <p style={{color: 'red'}}>{error}</p>}
            <button className="responseButton"
                    onClick={() => setError("Авторизируйтесь, чтобы откликнуться на вакансию")}>Откликнуться</button>
            </div>
        );
    }

    const hasResponded = userVacancies.some(uv => uv.id === vacancyId);

    return (
        <div>
            {error && <p style={{color: 'red'}}>{error}</p>}
            {!hasResponded && (
                <button
                    className="responseButton"
                    onClick={() => setShowModal(true)}
                >
                    Откликнуться
                </button>
            )}
            {hasResponded && (
                <button
                    className="responseButton-responded"
                    onClick={() => setError("Вы уже откликнулись на эту вакансию")}
                >
                    Откликнуться
                </button>
            )}
            <SubmitResumeModal vacancyId={vacancyId}/>
        </div>
    )
}

export default ResponseButton;