const API_URL = "/api/books";

export const bookService = {
    async getAll() {
        const response = await fetch(API_URL);
        return await response.json();
    },

    async getById(id: string) {
        const response = await fetch(`${API_URL}/${id}`);
        return await response.json();
    },

    async checkAccess(id: string) {
        const response = await fetch(`${API_URL}/${id}/access`);
        return await response.json();
    },

    async purchase(id: string) {
        const response = await fetch(`${API_URL}/${id}/purchase`, {
            method: "POST",
            headers: { "Content-Type": "application/json" }
        });
        return await response.json();
    },

    // Admin methods
    async create(data: any) {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });
        return await response.json();
    },

    async update(id: string, data: any) {
        const response = await fetch(`${API_URL}/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });
        return await response.json();
    },

    async delete(id: string) {
        const response = await fetch(`${API_URL}/${id}`, {
            method: "DELETE"
        });
        return response.ok;
    }
};
