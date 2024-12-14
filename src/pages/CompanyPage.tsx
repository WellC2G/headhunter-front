import React, {useEffect} from "react";
import Header from "../components/Header.tsx";
import axios from "axios";
import {atom, useAtom} from "jotai";
import CreateCompanyModal from "../components/CreateCompanyModal.tsx";
import {showModalCreateCompanyAtom} from "../atoms/atoms.tsx";
import "../styles/CompanyPage.css"


const errorAtom = atom<string | null>(null);
const roleAtom = atom("applicant");

const CompanyPage: React.FC = () => {
    const [error, setError] = useAtom(errorAtom);
    const [role, setRole] = useAtom(roleAtom);
    const [, setShowCreateModal] = useAtom(showModalCreateCompanyAtom);


    useEffect(() => {
        const fethData = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await axios.get("http://localhost:3000/user/check-auth", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                });
                setRole(response.data.role);
            } catch (err: any) {
                setError(err.response?.data?.error || "An error occurred");
            }
        };
        fethData();
    }, [])

    return (
        <><Header />
        <div className="companyPage">
            {error && <p style={{color: 'red'}}>{error}</p>}
                <div>
                    {role == "applicant" ? (
                        <button onClick={() => setShowCreateModal(true)} className="companyPage-button">
                        Создать компанию
                    </button>
                    ) : (
                        <p>Вы уже состоите в компании</p>
                    )}

                </div>
            <CreateCompanyModal/>
        </div>
        </>)
};

export default CompanyPage;