import React, { useState } from "react";
import "../styles/SearchBar.css";

const SearchBar: React.FC = () => {
    const [query, setQuery] = useState("");

    const handleSearch = () => {
        alert(`Searching for jobs: ${query}`);
    };

    return (
        <div className={"container"}>
            <input
                type="text"
                placeholder="Поиск вакансий"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className={"input"}
            />
            <button onClick={handleSearch} className={"button"}>
                Поиск
            </button>
        </div>
    );
};

export default SearchBar;
