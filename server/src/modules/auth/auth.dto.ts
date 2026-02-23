import { Role } from "@prisma/client";

export interface RegisterDTO {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phoneNumber?: string;
    role?: Role;
}

export interface LoginDTO {
    email: string;
    password: string;
}

export interface VerifyOtpDTO {
    email: string;
    code: string;
}

export interface ResendOtpDTO {
    email: string;
}
