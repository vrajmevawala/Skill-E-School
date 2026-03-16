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
    setUser: (user: User | null) => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
    user: JSON.parse(localStorage.getItem("user") || "null"),
    token: localStorage.getItem("token"),
    isLoading: !!localStorage.getItem("token"), // Start as loading if we have a token to verify
    error: null,

    setUser: (user) => {
        if (user) {
            localStorage.setItem("user", JSON.stringify(user));
        } else {
            localStorage.removeItem("user");
        }
        set({ user });
    },

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
            localStorage.setItem("user", JSON.stringify(user));
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
            localStorage.setItem("user", JSON.stringify(user));
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
        localStorage.removeItem("user");
        set({ user: null, token: null });
    },

    fetchMe: async () => {
        const token = localStorage.getItem("token");
        if (!token) {
            set({ isLoading: false });
            return;
        }
        set({ isLoading: true });
        try {
            const res = await api.get("/auth/me");
            localStorage.setItem("user", JSON.stringify(res.user));
            set({ user: res.user, token, isLoading: false });
        } catch (err: any) {
            console.error("Fetch me failed:", err);
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            set({ user: null, token: null, isLoading: false });
        }
    },

    clearError: () => set({ error: null }),

    initialize: async () => {
        const token = localStorage.getItem("token");
        if (token) {
            // Immediately set token to allow api calls to include it
            set({ token });
            await get().fetchMe();
        } else {
            set({ isLoading: false });
        }
    },
}));
