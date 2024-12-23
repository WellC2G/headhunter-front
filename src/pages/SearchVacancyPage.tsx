import { atom, useAtom } from 'jotai';
import '../styles/SearchVacancyPage.css'
import {vacanciesAtom} from "../atoms/atoms.tsx";
import Header from "../components/Header.tsx";
import SearchBar from "../components/SearchBar.tsx";
import React from "react";
import {Link} from "react-router-dom";

const modalErrorAtom = atom<string | null>(null);

const SearchVacancyPage: React.FC = () => {

    const [vacancies] = useAtom(vacanciesAtom);
    const [error, setError] = useAtom(modalErrorAtom);
    
    return (
        <><Header/><><SearchBar/>
            <div className="searchVacancyPage">
                <h2>Найденные вакансии</h2>
                <div className={"searchVacancyPage-vacancies"}>
                    {error && <p style={{color: 'red'}}>{error}</p>}
                    {vacancies.length === 0 ? (<p>Нет найденных вакансий</p>) : null}
                    {vacancies.map((vacancy) => (
                        <div key={vacancy.id} className="vacancy-item">
                            <div className="vacancy-info">
                                <Link to={`/vacancy/${vacancy.id}`} className={"vacancy-link"}>
                                    <h3>{vacancy.title}</h3>
                                    <p>{vacancy.salary}</p>
                                </Link>
                                <div className="company-info">
                                    <label className={"vacancy-label"}>Компания:</label>
                                    <p>{vacancy.company.name}</p>
                                </div>
                            </div>
                            <button className={"vacancyPage-button"}>Откликнуться</button>
                        </div>
                        ))}
                </div>
                </div>
            </>
        </>
            );
            }

export default SearchVacancyPage;