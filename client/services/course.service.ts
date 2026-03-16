import { api } from "../lib/api";

export const courseService = {
  getAll: (params?: string) => api.get(`/courses${params ? `?${params}` : ""}`),
  getCategories: () => api.get("/courses/categories"),
  getById: (id: string) => api.get(`/courses/${id}`),
  getMyCourses: () => api.get("/courses/my-courses"),
  checkAccess: (id: string) => api.get(`/courses/${id}/access`),
  enroll: (id: string) => api.post(`/courses/${id}/enroll`, {}),
  createPaymentIntent: (id: string) => api.post(`/courses/${id}/create-payment-intent`, {}),
  verifyPayment: (id: string, paymentId: string) => api.get(`/courses/${id}/verify-payment/${paymentId}`),
  
  // Admin only
  create: (data: any) => api.post("/courses", data),
  update: (id: string, data: any) => api.patch(`/courses/${id}`, data),
  delete: (id: string) => api.delete(`/courses/${id}`),
};
