const API_BASE = "/api";

interface ApiOptions extends RequestInit {
    token?: string;
}

async function apiFetch<T = any>(endpoint: string, options: ApiOptions = {}): Promise<T> {
    const { token, headers, ...rest } = options;

    const res = await fetch(`${API_BASE}${endpoint}`, {
        headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...headers,
        },
        ...rest,
    });

    const json = await res.json();

    if (!res.ok) {
        const message = json?.error?.message || json?.message || "Something went wrong";
        const error: any = new Error(message);
        error.status = res.status;
        throw error;
    }

    return json.data ?? json;
}

export const api = {
    get: <T = any>(endpoint: string, token?: string) =>
        apiFetch<T>(endpoint, { method: "GET", token }),

    post: <T = any>(endpoint: string, body: any, token?: string) =>
        apiFetch<T>(endpoint, { method: "POST", body: JSON.stringify(body), token }),

    put: <T = any>(endpoint: string, body: any, token?: string) =>
        apiFetch<T>(endpoint, { method: "PUT", body: JSON.stringify(body), token }),

    delete: <T = any>(endpoint: string, token?: string) =>
        apiFetch<T>(endpoint, { method: "DELETE", token }),
};
