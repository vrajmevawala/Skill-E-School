import { api } from "../lib/api";

export const consultancyService = {
  getExperts: () => api.get("/consultancy/experts"),
  book: (data: any) => api.post("/consultancy/book", data),
};
