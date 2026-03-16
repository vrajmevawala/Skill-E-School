import { api } from "../lib/api";

export const authService = {
  register: (data: any) => api.post("/auth/register", data),
  verifyOtp: (data: any) => api.post("/auth/verify-otp", data),
  resendOtp: (email: string) => api.post("/auth/resend-otp", { email }),
  login: (data: any) => api.post("/auth/login", data),
  logout: () => api.post("/auth/logout", {}),
  getMe: () => api.get("/auth/me"),
  
  // Admin only
  getAllUsers: () => api.get("/auth/users"),
  updateUser: (id: string, data: any) => api.patch(`/auth/users/${id}`, data),
  updateProfile: (id: string, data: any) => api.patch(`/auth/users/${id}`, { profile: data }),
  deleteUser: (id: string) => api.delete(`/auth/users/${id}`),
};
