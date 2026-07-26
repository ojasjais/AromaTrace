import { getStoredToken } from "./auth";

const API_URL = `${import.meta.env.VITE_API_URL}/reports`;

const getHeaders = (headers = {}) => {
  const token = getStoredToken();
  const authHeaders = { ...headers };
  if (token) {
    authHeaders["Authorization"] = `Bearer ${token}`;
  }
  return authHeaders;
};

export const getReportSummary = async () => {
  const response = await fetch(`${API_URL}/dashboard`, {
    headers: getHeaders(),
  });
  if (!response.ok) {
    throw new Error("Failed to fetch reports summary");
  }
  return response.json();
};
