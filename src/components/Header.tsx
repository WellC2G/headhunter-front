import React, {useEffect} from "react";
import "../styles/Header.css"
import logo from "../assets/HeadHunter_logo.png"
import {Link} from "react-router-dom";
import {atom, useAtom} from "jotai";

const isAuthenticatedAtom = atom(false);
const isCompanyAtom = atom(false);

const Header: React.FC = () => {
    const [isAuthenticated, setIsAuthenticated] = useAtom(isAuthenticatedAtom);
    const [isCompany, setIsCompany] = useAtom(isCompanyAtom);
    const token = localStorage.getItem("token");
    const companyId = localStorage.getItem("companyId");

    useEffect(() => {
        const fetchData = async () => {
            if (token) {
                setIsAuthenticated(true);
            } else {
                setIsAuthenticated(false);
                localStorage.removeItem("token");
            }
            if (companyId) {
                setIsCompany(true);
            } else {
                setIsCompany(false);
            }
        };
        fetchData() ;
    }, []);

    return (
        <header className={"header"}>
            <Link to="/">
            <img src={logo} className="logo" alt={"Логотип HH"}/>
            </Link>
            {isAuthenticated ? (
                <div className={"nav"}>
                    {isCompany ? (
                        <Link to={`/company/${companyId}`}>
                            <button className={"button"}>Компания</button>
                        </Link>
                        ) : (
                            <div className="nav">
                            <Link to={"/resume"}>
                                <button className={"button"}>Резюме</button>
                            </Link>
                            <Link to={"/company"}>
                                <button className={"button"}>Компания</button>
                            </Link>
                            </div>
                        )}
                    <Link to={"/user/profile"}>
                        <button className={"button"}>Профиль</button>
                    </Link>
                </div>
            ) : (
                <div className={"nav"}>
                    <Link to={"/auth/login"}>
                        <button className={"button"}>Войти</button>
                    </Link>
                    <Link to={"/auth/register"}>
                        <button className={"button"}>Регистрация</button>
                    </Link>
            </div>
            )}
        </header>
    );
};

export default Header;