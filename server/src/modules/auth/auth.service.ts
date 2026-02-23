import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../../lib/prisma";
import { AppError } from "../../utils/app-error";
import { sendOtpEmail } from "../../utils/email";
import { RegisterDTO, LoginDTO, VerifyOtpDTO } from "./auth.dto";

const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";
const OTP_EXPIRY_MINUTES = Number(process.env.OTP_EXPIRY_MINUTES) || 5;

function generateOtp(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

export class AuthService {
    static async register(data: RegisterDTO) {
        if (!data.email || !data.password || !data.firstName || !data.lastName) {
            throw new AppError("Please provide all required fields", 400);
        }

        const existingUser = await prisma.user.findUnique({
            where: { email: data.email },
        });

        if (existingUser) {
            if (!existingUser.emailVerified) {
                // If not verified, allow "re-registration" (update details and resend OTP)
                const hashedPassword = await bcrypt.hash(data.password, 12);
                await prisma.user.update({
                    where: { id: existingUser.id },
                    data: {
                        password: hashedPassword,
                        profile: {
                            upsert: {
                                create: {
                                    firstName: data.firstName,
                                    lastName: data.lastName,
                                    phoneNumber: data.phoneNumber,
                                },
                                update: {
                                    firstName: data.firstName,
                                    lastName: data.lastName,
                                    phoneNumber: data.phoneNumber,
                                }
                            }
                        }
                    }
                });
                
                await this.createAndSendOtp(existingUser.email);
                return {
                    user: {
                        id: existingUser.id,
                        email: existingUser.email,
                        role: existingUser.role,
                        emailVerified: existingUser.emailVerified,
                    },
                    message: "An account with this email already exists but is not verified. Details updated and a new OTP has been sent."
                };
            }
            throw new AppError("Email already in use", 400);
        }

        const hashedPassword = await bcrypt.hash(data.password, 12);

        const user = await prisma.user.create({
            data: {
                email: data.email,
                password: hashedPassword,
                role: data.role || "STUDENT",
                emailVerified: false,
                profile: {
                    create: {
                        firstName: data.firstName,
                        lastName: data.lastName,
                        phoneNumber: data.phoneNumber,
                    },
                },
            },
            include: { profile: true },
        });

        // Generate and send OTP
        await this.createAndSendOtp(user.email);

        return { user: { id: user.id, email: user.email, role: user.role, emailVerified: user.emailVerified, profile: user.profile }, message: "Registration successful. Please verify your email with the OTP sent." };
    }

    static async verifyOtp(data: VerifyOtpDTO) {
        const otp = await prisma.otp.findFirst({
            where: {
                email: data.email,
                code: data.code,
                used: false,
                expiresAt: { gte: new Date() },
            },
            orderBy: { createdAt: "desc" },
        });

        if (!otp) {
            throw new AppError("Invalid or expired OTP", 400);
        }

        // Mark OTP as used and verify user email
        await prisma.$transaction([
            prisma.otp.update({ where: { id: otp.id }, data: { used: true } }),
            prisma.user.update({ where: { email: data.email }, data: { emailVerified: true } }),
        ]);

        const user = await prisma.user.findUnique({
            where: { email: data.email },
            include: { profile: true },
        });

        if (!user) throw new AppError("User not found", 404);

        const token = this.generateToken(user.id, user.role);

        return { user: { id: user.id, email: user.email, role: user.role, emailVerified: user.emailVerified, profile: user.profile }, token };
    }

    static async resendOtp(email: string) {
        const user = await prisma.user.findUnique({ where: { email } });

        if (!user) {
            throw new AppError("No account found with that email", 404);
        }

        if (user.emailVerified) {
            throw new AppError("Email is already verified", 400);
        }

        await this.createAndSendOtp(email);

        return { message: "A new OTP has been sent to your email." };
    }

    private static async createAndSendOtp(email: string) {
        // Invalidate previous unused OTPs
        await prisma.otp.updateMany({
            where: { email, used: false },
            data: { used: true },
        });

        const code = generateOtp();
        const expiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);

        await prisma.otp.create({
            data: { email, code, expiresAt },
        });

        await sendOtpEmail(email, code);
    }

    static async login(data: LoginDTO) {
        const user = await prisma.user.findUnique({
            where: { email: data.email },
            include: { profile: true },
        });

        if (!user || !(await bcrypt.compare(data.password, user.password))) {
            throw new AppError("Invalid email or password", 401);
        }

        if (!user.emailVerified) {
            // Resend OTP on login attempt if not verified
            await this.createAndSendOtp(user.email);
            throw new AppError("Email not verified. A new OTP has been sent to your email.", 403);
        }

        const token = this.generateToken(user.id, user.role);

        return { user: { id: user.id, email: user.email, role: user.role, emailVerified: user.emailVerified, profile: user.profile }, token };
    }

    static async getMe(userId: string) {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: { profile: true },
        });

        if (!user) {
            throw new AppError("User not found", 404);
        }

        return { id: user.id, email: user.email, role: user.role, emailVerified: user.emailVerified, profile: user.profile };
    }

    private static generateToken(userId: string, role: string) {
        return jwt.sign({ id: userId, role }, JWT_SECRET, {
            expiresIn: JWT_EXPIRES_IN,
        });
    }
}
