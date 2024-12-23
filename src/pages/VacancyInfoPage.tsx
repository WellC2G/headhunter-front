import React, {useEffect} from "react";
import Header from "../components/Header.tsx";
import axios from "axios";
import {atom, useAtom} from "jotai";
import {useParams} from "react-router-dom";
import '../styles/VacancyInfoPage.css'

const titleAtom = atom("");
const descriptionAtom = atom<string>("");
const errorAtom = atom<string | null>(null);
const salaryAtom = atom<string>("");

const nameCompanyAtom = atom<string>("");
const descriptionCompanyAtom = atom<string>("");
const avatarAtom = atom<string>("");

const VacancyInfoPage: React.FC = () => {

    const [title, setTitle] = useAtom(titleAtom);
    const [salary, setSalary] = useAtom(salaryAtom);
    const [description, setDescription] = useAtom(descriptionAtom);
    const [name, setName] = useAtom(nameCompanyAtom);
    const [descriptionCompany, setDescriptionCompany] = useAtom(descriptionCompanyAtom);
    const [avatarUrl, setAvatarUrl] = useAtom(avatarAtom);
    const [error, setError] = useAtom(errorAtom);

    const {vacancyId} = useParams();

    useEffect(() => {
        const fethData = async () => {
            try {

                const response = await axios.get(`http://localhost:3000/vacancy/info/${vacancyId}`, {
                });

                setTitle(response.data.title);
                setSalary(response.data.salary);
                setName(response.data.company.name);
                setDescriptionCompany(response.data.company.description);
                setAvatarUrl("http://localhost:3000/" + response.data.company.avatar);
                setDescription(response.data.description);

            } catch (err: any) {
                setError(err.response?.data?.error || "An error occurred");
            }
        };
        fethData();
    }, [])

    return (
        <><Header />
            {error && <p style={{color: 'red'}}>{error}</p>}
            <div className="vacancyInfoPage">
                <div className="vacancyInfoPage-details">
                    <h3 className={"vacancyInfoPage-h3 vacancyInfoPage-header"}>Вакансия</h3>
                    <div>
                        <p className={"vacancyInfoPage-p vacancyInfoPage-title"}>{title}</p>
                    </div>
                    <div className="vacancyInfoPage-salary-container">
                        <label htmlFor="name" className={"vacancyInfoPage-label vacancyInfoPage-salary-label"}>Предлагаемая
                            зарплата:</label>
                        <p className={"vacancyInfoPage-p vacancyInfoPage-salary"}>{salary}</p>
                    </div>
                    <div className="vacancyInfoPage-description-block">
                        <label htmlFor="name" className={"vacancyInfoPage-label"}>Описание
                            вакансии:</label>
                        <div className="vacancyInfoPage-description"
                                 dangerouslySetInnerHTML={{__html: description}}/>
                    </div>
                    <button className={"vacancyInfoPage-button"}>Откликнуться</button>
                </div>
                <div className="vacancyInfoPage-company-info">
                    <h3 className={"vacancyInfoPage-h3 vacancyInfoPage-company-title"}>Компания</h3>
                    <div className="vacancyInfoPage-company-content">
                        <div className="vacancyInfoPage-avatar">
                            <div className="avatar-preview">
                                {avatarUrl ? (
                                    <img src={avatarUrl} alt="Avatar" className="avatar-preview-image"/>
                                ) : (
                                    <div className="avatar-placeholder"></div>
                                )}
                            </div>
                        </div>
                        <div className="vacancyInfoPage-company-name">
                            <p className={"vacancyInfoPage-p"}>{name}</p>
                        </div>
                    </div>
                    <p className={"vacancyInfoPage-p vacancyInfoPage-company-description"}>{descriptionCompany}</p>
                </div>
            </div>
        </>)
};

export default VacancyInfoPage;