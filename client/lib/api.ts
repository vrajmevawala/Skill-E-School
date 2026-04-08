import { toast } from "sonner";

const API_BASE = import.meta.env.VITE_API_URL || "/api";

interface ApiOptions extends RequestInit {
    token?: string;
}

async function apiFetch<T = any>(endpoint: string, options: ApiOptions = {}): Promise<T> {
    const { token: providedToken, headers, ...rest } = options;
    const token = providedToken || localStorage.getItem("token");

    try {
        const res = await fetch(`${API_BASE}${endpoint}`, {
            headers: {
                "Content-Type": "application/json",
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
                ...headers,
            },
            ...rest,
        });

        // Handle raw responses or empty responses if needed
        const contentType = res.headers.get("content-type");
        let json: any = {};
        if (contentType && contentType.includes("application/json")) {
            json = await res.json();
        }

        if (!res.ok) {
            // Check for unauthorized access
            if (res.status === 401) {
                localStorage.removeItem("token");
                // Avoid infinite redirect if already on login
                if (!window.location.pathname.includes("/login")) {
                    window.location.href = "/login";
                }
            }

            const message = json?.error?.message || json?.message || "Something went wrong";
            
            // Show toast for server errors 500+
            if (res.status >= 500) {
                toast.error("Internal Server Error. Please try again later.");
            }

            const error: any = new Error(message);
            error.status = res.status;
            throw error;
        }

        // Standard envelop unwrapping: { status, data, message }
        return json.data ?? json;
    } catch (error: any) {
        if (!error.status) {
            toast.error("Network Error: Please check your internet connection.");
        }
        throw error;
    }
}

export const api = {
    get: <T = any>(endpoint: string, token?: string) =>
        apiFetch<T>(endpoint, { method: "GET", token }),

    post: <T = any>(endpoint: string, body: any, token?: string) =>
        apiFetch<T>(endpoint, { method: "POST", body: JSON.stringify(body), token }),

    put: <T = any>(endpoint: string, body: any, token?: string) =>
        apiFetch<T>(endpoint, { method: "PUT", body: JSON.stringify(body), token }),

    patch: <T = any>(endpoint: string, body: any, token?: string) =>
        apiFetch<T>(endpoint, { method: "PATCH", body: JSON.stringify(body), token }),

    delete: <T = any>(endpoint: string, token?: string) =>
        apiFetch<T>(endpoint, { method: "DELETE", token }),
};
