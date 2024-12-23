import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import RegisterPage from "./pages/RegisterPage";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage.tsx";
import UserProfilePage from "./pages/UserProfilePage.tsx";
import CompanyPage from "./pages/CompanyPage.tsx";
import CompanyIdPage from "./pages/CompanyIdPage.tsx";
import AddManagerPage from "./pages/AddManagerPage.tsx";
import VacancyPage from "./pages/VacancyPage.tsx";
import SearchVacancyPage from "./pages/SearchVacancyPage.tsx";
import VacancyInfoPage from "./pages/VacancyInfoPage.tsx";
import ResumePage from "./pages/ResumePage.tsx";


const App: React.FC = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/auth/register" element={<RegisterPage />} />
                <Route path="/auth/login" element={<LoginPage />} />
                <Route path="/user/profile" element={<UserProfilePage />} />
                <Route path="/company" element={<CompanyPage />} />
                <Route path="/company/:id" element={<CompanyIdPage />} />
                <Route path="/company/managers/add/:companyId" element={<AddManagerPage />} />
                <Route path="/vacancy" element={<VacancyPage />} />
                <Route path="/resume" element={<ResumePage />} />
                <Route path="/search" element={<SearchVacancyPage />} />
                <Route path="/vacancy/:vacancyId" element={<VacancyInfoPage />} />
            </Routes>
        </Router>
    );
};

export default App;