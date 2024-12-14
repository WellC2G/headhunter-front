import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/AuthPage.css"

const LoginPage: React.FC = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const navigate = useNavigate();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const response = await axios.post("http://localhost:3000/auth/login", {
                email,
                password,
            });

            const token = response.data.token;

            localStorage.setItem("token", token);

            if (token) {
                navigate("/");
            }

            const responseCompany = await axios.get("http://localhost:3000/company/get-company-id", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (responseCompany.data.companyId) {
                localStorage.setItem("companyId", responseCompany.data.companyId);
            }

        } catch (err: any) {
            setError(err.response?.data?.error || "An error occurred");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="authPage">
            <h2 className={"authPage-h1"}>Вход</h2>
            <form onSubmit={handleRegister}>
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
                    {loading ? "Вход..." : "Войти"}
                </button>
                {error && <p style={{color: "red"}}>{error}</p>}
            </form>
        </div>
    );
};

export default LoginPage;
