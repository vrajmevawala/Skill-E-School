import { api } from "../lib/api";

export const settingsService = {
  getSettings: () => api.get("/settings"),
  updateSettings: (data: any) => api.patch("/settings", data),
  backupDatabase: () => api.post("/settings/backup", {}),
  testSmtp: () => api.post("/settings/test-smtp", {}),
};
