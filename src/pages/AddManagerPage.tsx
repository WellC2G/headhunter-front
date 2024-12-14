import React, {useEffect, useState} from "react";
import axios from "axios";
import {useNavigate, useParams} from "react-router-dom";
import "../styles/AddManagerPage.css"

const AddManagerPage: React.FC = () => {
    const [error, setError] = useState<string | null>(null);
    const {companyId} = useParams();
    const token = localStorage.getItem("token");

    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem("token");
                await axios.get("http://localhost:3000/user/check-auth", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
            } catch (err: any) {
                setError(err.response?.data?.error || "An error occurred");
            }
        };
        fetchData();
    }, []);

    const handleAddManager = async () => {
        try {
            const response = await axios.put(`http://localhost:3000/company/managers/add/${companyId}`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if(response.status === 201) {
                setError(response?.data?.message || "An error occurred");
                return;
            }

            if (typeof companyId === "string") {
                localStorage.setItem("companyId", companyId);
            }
            navigate(`/company/${companyId}`);
            setError(null);

        } catch (err: any) {
            setError(err.response?.data?.message || "An error occurred");
        }
    };

    return (
        <div className="addManagerPage">
            {error && <p style={{color: 'red'}}>{error}</p>}
            <div className="addManagerPage-div">
            <h1 className={"addManagerPage-h1"}>Стать менеджером</h1>
            <button onClick={handleAddManager} className="addManagerPage-button">
                Принять заявку
            </button>
            </div>
        </div>
    );
};

export default AddManagerPage;
