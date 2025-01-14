import {atom} from "jotai";

interface Vacancy {
    id: number;
    title: string;
    salary: string;
    company: Company;
}

interface Company {
    id: number;
    name: string;
    description: string;
}

export const showModalCreateCompanyAtom = atom(false);
export const showModalEditCompanyAtom = atom(false);
export const showModalManagerAddAtom = atom(false);
export const showModalCreateVacancyAtom = atom(false);
export const showModalEditVacancyAtom = atom(false);
export const showModalCreateResumeAtom = atom(false);
export const showModalEditResumeAtom = atom(false);
export const showModalSubmitResumeAtom = atom(false);

export const vacanciesAtom = atom<Vacancy[]>([]);
export const vacanciesUserAtom = atom<Vacancy[]>([]);

export const activeVacancyIdAtom = atom<number | null | undefined>(null);