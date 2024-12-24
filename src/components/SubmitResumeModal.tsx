import { atom, useAtom } from 'jotai';
import axios from 'axios';
import '../styles/modal.css'
import {showModalSubmitResumeAtom} from "../atoms/atoms.tsx";
import React, {useEffect} from "react";
import {useNavigate} from "react-router-dom";

interface Resume {
    id: number;
    title: string;
}

interface SubmitResumeModalProps {
    vacancyId: number | undefined | string;
}

const selectedResumeIdAtom = atom<number | null>(null);

const modalLoadingAtom = atom(false);
const modalErrorAtom = atom<string | null>(null);
const resumesAtom = atom<Resume[]>([]);

const SubmitResumeModal: React.FC<SubmitResumeModalProps> = ({vacancyId}) => {
    const [showModal, setShowModal] = useAtom(showModalSubmitResumeAtom);
    const [resumes, setResumes] = useAtom(resumesAtom);
    const [loading, setLoading] = useAtom(modalLoadingAtom);
    const [error, setError] = useAtom(modalErrorAtom);

    const [selectedResumeId, setSelectedResumeId] = useAtom(selectedResumeIdAtom);

    const navigate = useNavigate();

    if(typeof vacancyId === "string") {
        parseInt(vacancyId)
    }

    if(typeof vacancyId === undefined) {
        return null;
    }

    useEffect(() => {
        const fethData = async () => {
            try {
                const token = localStorage.getItem("token");

                const response =  await axios.get("http://localhost:3000/resume/list/resumes", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                });

                setResumes(response.data);

            } catch (err: any) {
                setError(err.response?.data?.message || "An error occurred");
            }
        };
        fethData();
    }, [])

    const handleSubmitResume = async (e: any) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            const token = localStorage.getItem("token");

            await axios.put(`http://localhost:3000/response-to-vacancy/${selectedResumeId}/create/${vacancyId}`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setShowModal(false);

            navigate('/')
            window.location.reload()

        } catch (err: any) {
            setError(err.response?.data?.message || "An error occurred");
        } finally {
            setLoading(false);
        }
    };

    if (!showModal) {
        return null;
    }

    return (
        <div className="modal">
            <div className="modal-content">
                <span className="close" onClick={() => setShowModal(false)}>&times;</span>
                <h2 className={"modal-h2"}>Отправить резюме</h2>
                {error && <p style={{color: 'red'}}>{error}</p>}
                <form onSubmit={handleSubmitResume} className="modal-form">
                    <div className="modal-resume-list">
                        {resumes.map((resume) => (
                            <div key={resume.id} className="modal-resume-item">
                                <input
                                    type="radio"
                                    id={`resume-${resume.id}`}
                                    name="resume"
                                    value={resume.id}
                                    checked={selectedResumeId === resume.id}
                                    onChange={() => setSelectedResumeId(resume.id)}
                                />
                                <label htmlFor={`resume-${resume.id}`}>{resume.title}</label>
                            </div>
                        ))}
                    </div>
                    <button type="submit" className={"modal-button"} disabled={loading || !selectedResumeId}>
                        {loading ? "Отправка..." : "Отправить"}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default SubmitResumeModal;