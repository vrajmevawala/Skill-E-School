import { api } from "../lib/api";

export const consultancyService = {
  getExperts: () => api.get("/consultancy/experts"),
  book: (data: any) => api.post("/consultancy/book", data),
  getAccess: () => api.get("/consultancy/access"),
  getMyBookings: () => api.get("/consultancy/my-bookings"),
  getGCalBookings: () => api.get("/consultancy/gcal-bookings"),
  createGCalBooking: (data: { expertId: string; scheduledAt: string; notes?: string; googleMeetLink?: string }) =>
    api.post("/consultancy/gcal-bookings", data),
  getLink: (id: string) => api.get(`/consultancy/experts/${id}/link`),
  purchase: (id: string) => api.post(`/consultancy/experts/${id}/purchase`, {}),
  createPaymentIntent: (id: string) => api.post(`/consultancy/experts/${id}/create-payment-intent`, {}),
  verifyPayment: (id: string, paymentId: string) => api.get(`/consultancy/experts/${id}/verify-payment/${paymentId}`),
  syncExpertBookings: (id: string) => api.get(`/consultancy/experts/${id}/sync`),
  getGoogleAuthUrl: () => api.get("/consultancy/google/auth"),
  
  // Admin methods
  getAdminExperts: () => api.get("/consultancy/admin/experts"),
  createExpert: (data: any) => api.post("/consultancy/experts", data),
  updateExpert: (id: string, data: any) => api.patch(`/consultancy/experts/${id}`, data),
  deleteExpert: (id: string) => api.delete(`/consultancy/experts/${id}`),
};
