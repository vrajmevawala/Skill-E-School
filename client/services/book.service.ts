import { api } from "../lib/api";

const API_URL = "/books";

export const bookService = {
    async getAll() {
        return api.get(API_URL);
    },

    async getById(id: string) {
        return api.get(`${API_URL}/${id}`);
    },

    async checkAccess(id: string) {
        return api.get(`${API_URL}/${id}/access`);
    },

    async purchase(id: string) {
        return api.post(`${API_URL}/${id}/purchase`, {});
    },

    // Admin methods
    async create(data: any) {
        return api.post(API_URL, data);
    },

    async update(id: string, data: any) {
        return api.patch(`${API_URL}/${id}`, data);
    },

    async delete(id: string) {
        return api.delete(`${API_URL}/${id}`);
    }
};
