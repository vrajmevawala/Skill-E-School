import { api } from "../lib/api";

export const consultancyService = {
  getExperts: () => api.get("/consultancy/experts"),
  book: (data: any) => api.post("/consultancy/book", data),
  
  // Admin methods
  createExpert: (data: any) => api.post("/consultancy/experts", data),
  updateExpert: (id: string, data: any) => api.patch(`/consultancy/experts/${id}`, data),
  deleteExpert: (id: string) => api.delete(`/consultancy/experts/${id}`),
};
