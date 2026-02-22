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

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // OPTIONAL: Add refresh logic later
        return api(originalRequest);
      } catch (refreshError) {
        window.location.href = "/login";
        return Promise.reject(refreshError);
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
