// Removed Role import because it's not in Prisma schema as Enum
export interface RegisterDTO {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phoneNumber?: string;
    role?: string;
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
