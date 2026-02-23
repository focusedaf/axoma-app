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
  (response) => response,
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
}) => {
  return api.post("/auth/candidate/register", payload);
};

export const loginCandidate = (payload: {
  email: string;
  password: string;
}) => {
  return api.post("/auth/candidate/login", payload);
};

export const fetchCandidateMe = () => api.get("/auth/me");

export const logoutCandidate = () => api.post("/auth/logout");