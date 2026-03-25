import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

if (!BASE_URL) {
  throw new Error("NEXT_PUBLIC_API_BASE_URL is not defined");
}

export const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes("/auth/refresh")
    ) {
      originalRequest._retry = true;

      try {
        await api.post("/auth/refresh");
        return api(originalRequest);
      } catch {
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  },
);

export const registerCandidate = (payload: {
  firstName: string;
  lastName: string;
  mobileNumber: string;
  email: string;
  password: string;
}) => api.post("/auth/candidate/register", payload);

export const loginCandidate = (payload: { email: string; password: string }) =>
  api.post("/auth/candidate/login", payload);

export const fetchCandidateMe = () => api.get("/auth/me");
export const logoutCandidate = () => api.post("/auth/logout");

export const upsertProfile = (payload: any) =>
  api.post("/onboarding/profile", payload);

export const getProfile = () => api.get("/onboarding/profile");

export const addDocuments = (formData: FormData) =>
  api.post("/onboarding/documents", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const getExamById = (examId: string) => api.get(`/exams/${examId}`);

export const lockAttemptApi = (data: { examId: string; fingerprint: string }) =>
  api.post("/lock-attempt", data);

export const verifyLockApi = (data: { examId: string; fingerprint: string }) =>
  api.post("/verify-lock", data);

export const submitExamApi = (data: { examId: string; answers: any }) =>
  api.post("/submit", data);

export const getResultApi = (examId: string) => api.get(`/results/${examId}`);

export const createViolationApi = (data: {
  examId: string;
  type: string;
  severity: string;
  metadata?: any;
}) => api.post("/violations", data);

export const getExamViolationsApi = (examId: string) =>
  api.get(`/violations/${examId}`);

export const getAllViolationsApi = () => api.get("/violations");

export const getDashboardApi = () => api.get("/dashboard");

export const getAllExamsApi = () => api.get("/exams");