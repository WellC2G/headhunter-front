import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/AuthPage.css"

const RegisterPage: React.FC = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const navigate = useNavigate();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const response = await axios.post("http://localhost:3000/auth/register", {
                email,
                password,
                firstName,
                lastName,
            });

            localStorage.setItem("token", response.data.token);

            if (response.data.token) {
                navigate("/");
            }
        } catch (err: any) {
            setError(err.response?.data?.error || "An error occurred");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="authPage">
            <h2 className={"authPage-h1"}>Регистрация</h2>
            <form onSubmit={handleRegister}>
                <div>
                    <label className={'authPage-label'} htmlFor="string">Имя</label>
                    <input
                        className={"authPage-input"}
                        type="text"
                        id="firstName"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        required
                    />
                    <label className={"authPage-label"} htmlFor="string">Фамилия</label>
                    <input
                        className={"authPage-input"}
                        type="text"
                        id="lastName"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label className={'authPage-label'} htmlFor="email">Почта</label>
                    <input
                        className={"authPage-input"}
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label className={"authPage-label"} htmlFor="password">Пароль</label>
                    <input
                        className={"authPage-input"}
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button className={"authPage-button"} type="submit" disabled={loading}>
                    {loading ? "Регистрация..." : "Регистрация"}
                </button>
                {error && <p style={{color: "red"}}>{error}</p>}
            </form>
        </div>
    );
};

export default RegisterPage;
