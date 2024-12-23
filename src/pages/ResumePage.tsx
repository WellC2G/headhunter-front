import React, {useEffect} from "react";
import Header from "../components/Header.tsx";
import axios from "axios";
import {atom, useAtom} from "jotai";
import "../styles/ResumePage.css"
import {
    showModalCreateResumeAtom,
    showModalEditResumeAtom
} from "../atoms/atoms.tsx";
import EditResumeModal from "../components/EditResumeModal.tsx";
import CreateResumeModal from "../components/CreateResumeModal.tsx";

interface Resume {
    id: number;
    title: string;
    description: string;
}

const errorAtom = atom<string | null>(null);
const resumesAtom = atom<Resume[]>([]);
const userRoleAtom = atom('');
const selectedResumeIdAtom = atom<number | null>(null);

const ResumePage: React.FC = () => {

    const [, setShowModal] = useAtom(showModalCreateResumeAtom);
    const [, setShowModalEdit] = useAtom(showModalEditResumeAtom);
    const [role, setRole] = useAtom(userRoleAtom);
    const [error, setError] = useAtom(errorAtom);
    const [resumes, setResumes] = useAtom(resumesAtom);
    const [selectedResumeId, setSelectedResumeId] = useAtom(selectedResumeIdAtom);


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

    const handleDeleteResume = async (resumeId: number) => {
        try {
            const token = localStorage.getItem("token");
            await axios.delete(`http://localhost:3000/resume/${resumeId}/delete`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setResumes(resumes.filter(resume => resume.id !== resumeId));

        } catch (err: any) {
            setError(err.response?.data?.message || "Ошибка при удалении менеджера");
        }
    };

    return (
        <><Header />
            <div className="resumePage">
                {error && <p style={{color: 'red'}}>{error}</p>}
                {role !== 'manager' || 'generalManager' ? (
                    <>
                        <div className="button-container">
                            <button onClick={() => setShowModal(true)} className={"resumePage-button"}>
                                Создать резюме
                            </button>
                        </div>
                        <div>
                            <h2>Резюме</h2>
                            <div>
                            {resumes.map((resume) => (
                                <div key={resume.id} className="resume-item">
                                    <div className="resume-info">
                                        <h3>{resume.title}</h3>
                                    </div>
                                    <button onClick={() => {setShowModalEdit(true);
                                        setSelectedResumeId(resume.id);}}
                                            className={"resumePage-button"}>
                                        Редактировать резюме
                                    </button>
                                    <span className="resume-button-delete"
                                          onClick={() => handleDeleteResume(resume.id)}>&times;</span>
                                </div>
                            ))}
                            </div>
                        </div>
                        <EditResumeModal resumeId={selectedResumeId}/>
                        <CreateResumeModal/>
                    </>
                ) : (
                    <p>Вы уже являетесь членом компании</p>
                )}
            </div>
        </>)
};

export default ResumePage;