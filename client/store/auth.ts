import { create } from "zustand";
import { api } from "@/lib/api";

interface Profile {
    id: string;
    firstName: string;
    lastName: string;
    phoneNumber?: string | null;
    avatarUrl?: string | null;
    bio?: string | null;
}

interface User {
    id: string;
    email: string;
    role: string;
    emailVerified: boolean;
    profile: Profile | null;
}

interface AuthState {
    user: User | null;
    token: string | null;
    isLoading: boolean;
    error: string | null;

    // Actions
    register: (data: { email: string; password: string; firstName: string; lastName: string; phoneNumber?: string; role?: string }) => Promise<{ needsOtp: boolean; email: string }>;
    verifyOtp: (email: string, code: string) => Promise<void>;
    resendOtp: (email: string) => Promise<void>;
    login: (email: string, password: string) => Promise<{ needsOtp: boolean; email: string }>;
    logout: () => void;
    fetchMe: () => Promise<void>;
    clearError: () => void;
    initialize: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
    user: null,
    token: localStorage.getItem("token"),
    isLoading: false,
    error: null,

    register: async (data) => {
        set({ isLoading: true, error: null });
        try {
            const res = await api.post("/auth/register", data);
            set({ isLoading: false });
            return { needsOtp: true, email: data.email };
        } catch (err: any) {
            set({ isLoading: false, error: err.message });
            throw err;
        }
    },

    verifyOtp: async (email, code) => {
        set({ isLoading: true, error: null });
        try {
            const res = await api.post("/auth/verify-otp", { email, code });
            const { user, token } = res;
            localStorage.setItem("token", token);
            set({ user, token, isLoading: false });
        } catch (err: any) {
            set({ isLoading: false, error: err.message });
            throw err;
        }
    },

    resendOtp: async (email) => {
        set({ isLoading: true, error: null });
        try {
            await api.post("/auth/resend-otp", { email });
            set({ isLoading: false });
        } catch (err: any) {
            set({ isLoading: false, error: err.message });
            throw err;
        }
    },

    login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
            const res = await api.post("/auth/login", { email, password });
            const { user, token } = res;
            localStorage.setItem("token", token);
            set({ user, token, isLoading: false });
            return { needsOtp: false, email };
        } catch (err: any) {
            // If 403, user needs to verify OTP
            if (err.status === 403) {
                set({ isLoading: false, error: null });
                return { needsOtp: true, email };
            }
            set({ isLoading: false, error: err.message });
            throw err;
        }
    },

    logout: () => {
        localStorage.removeItem("token");
        set({ user: null, token: null });
    },

    fetchMe: async () => {
        const token = get().token;
        if (!token) return;
        set({ isLoading: true });
        try {
            const res = await api.get("/auth/me", token);
            set({ user: res.user, isLoading: false });
        } catch {
            localStorage.removeItem("token");
            set({ user: null, token: null, isLoading: false });
        }
    },

    clearError: () => set({ error: null }),

    initialize: async () => {
        const token = get().token;
        if (token) {
            await get().fetchMe();
        }
    },
}));
