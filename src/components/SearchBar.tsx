import React from "react";
import "../styles/SearchBar.css";
import {atom, useAtom} from "jotai";
import axios from "axios";
import {useNavigate} from "react-router-dom";
import {vacanciesAtom} from "../atoms/atoms.tsx";

const queryAtom = atom('');
const loadingAtom = atom(false);
const errorAtom = atom<string | null>(null);

const SearchBar: React.FC = () => {
    const [query, setQuery] = useAtom(queryAtom);
    const [loading, setLoading] = useAtom(loadingAtom);
    const [error, setError] = useAtom(errorAtom);
    const [, setVacancies] = useAtom(vacanciesAtom);

    const navigate = useNavigate();

    const handleSearch = async (e: any) => {
        setLoading(true);
        setError(null);
        e.preventDefault();

        const trimmedQuery = query.trim();
        try {

            if(trimmedQuery == '') {
                return;
            }

            const response = await axios.get(`http://localhost:3000/vacancy/home/search?title=${trimmedQuery}`, {});
            setVacancies(response.data);

            const currentURL = window.location.pathname;

            if (currentURL == "/") {
                navigate('/search');
            }

        } catch (err: any) {
            setError(err.response?.data?.error || "An error occurred");
        } finally {
            setLoading(false);
        }
    };

    const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            e.preventDefault();
            handleSearch(e);
        }
    };

    return (
        <div className={"container"}>
            {error && <p style={{color: 'red'}}>{error}</p>}
            <input
                type="text"
                placeholder="Поиск вакансий"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                className={"input"}
            />
            <button onClick={handleSearch} className={"button"} disabled={loading}>
                {loading ? "Поиск..." : "Поиск"}
            </button>
        </div>
    );
};

export default SearchBar;
