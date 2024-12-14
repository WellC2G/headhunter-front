import React from "react";
import Header from "../components/Header";
import SearchBar from "../components/SearchBar";
import "../styles/HomePage.css";

const HomePage: React.FC = () => {
    return (
        <div className={"page"}>
            <Header />
            <main className={"main"}>
                <h2>Работа найдется для каждого</h2>
                <SearchBar />
            </main>
        </div>
    );
};

export default HomePage;
