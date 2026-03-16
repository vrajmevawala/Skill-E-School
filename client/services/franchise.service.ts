import { api } from "../lib/api";

export const franchiseService = {
  createInquiry: (data: any) => api.post("/franchise/inquiry", data),
  
  // Partner / Admin
  getDashboard: () => api.get("/franchise/dashboard"),
  getLeads: () => api.get("/franchise/leads"),
  getPayouts: () => api.get("/franchise/payouts"),
  
  // Admin only
  getAllInquiries: () => api.get("/franchise/admin/inquiries"),
  updateInquiry: (id: string, status: string) => api.patch(`/franchise/admin/inquiries/${id}`, { status }),
  getAllPartners: () => api.get("/franchise/admin/partners"),
};
