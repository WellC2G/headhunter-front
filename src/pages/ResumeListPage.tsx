import React, {useEffect} from "react";
import Header from "../components/Header.tsx";
import axios from "axios";
import {atom, useAtom} from "jotai";
import "../styles/ResumeListPage.css"
import {Link} from "react-router-dom";

interface Resume{
    id: number;
    title: string;
    submittedResumes: Vacancy[];
}

interface Vacancy{
    id: number;
    title: string;
    salary: string;
    company: Company;
}
interface Company{
    id: number;
}

const errorAtom = atom<string | null>(null);
const ResumesAtom = atom<Resume[]>([]);

const ResumeListPage: React.FC = () => {

    const [error, setError] = useAtom(errorAtom);
    const [resumes, setResumes] = useAtom(ResumesAtom);

    useEffect(() => {
        const fethData = async () => {
            try {
                const token = localStorage.getItem("token");
                await axios.get("http://localhost:3000/user/check-auth", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                });

                const responseResume = await axios.get(`http://localhost:3000/resume/list/resumes`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                });

                setResumes(responseResume.data);

            } catch (err: any) {
                setError(err.response?.data?.error || "An error occurred");
            }
        };
        fethData();
    }, []);

    return (
        <><Header />
            <div className="responsePage">
                {error && <p style={{color: 'red'}}>{error}</p>}
                    <>
                        <div>
                            <h2>Чаты с компаниями</h2>
                            <div>
                                {resumes.map((resume) => (
                                    <div key={resume.id}>
                                        <div className="resume-item">
                                            <div className="resume-info">
                                                <h3>{resume.title}</h3>
                                            </div>
                                        </div>
                                        <div className="vacancies-block">
                                            {resume.submittedResumes.map((vacancy) => (
                                                <div key={vacancy.id} className="response-info">
                                                    <h4>{vacancy.title}</h4>
                                                    <Link to={`/chat/${vacancy.company.id}`} className={"resumeListPage-button"}> Чат
                                                    </Link>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </>
            </div>
        </>)
};

export default ResumeListPage;