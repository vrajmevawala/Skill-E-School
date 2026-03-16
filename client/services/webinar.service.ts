import { api } from "../lib/api";

export const webinarService = {
  getAll: () => api.get("/webinars"),
  register: (id: string) => api.post(`/webinars/register/${id}`, {}),
  
  // Admin only
  create: (data: any) => api.post("/webinars", data),
  update: (id: string, data: any) => api.patch(`/webinars/${id}`, data),
  delete: (id: string) => api.delete(`/webinars/${id}`),
};
