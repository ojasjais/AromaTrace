import { getStoredToken } from "./auth";

const API_URL = `${import.meta.env.VITE_API_URL}/buyers`;

const parseError = async (response, fallback) => {
  const data = await response.json().catch(() => ({}));
  if (response.status === 401) {
    throw new Error(data.message || "Please log in to perform this action");
  }
  throw new Error(data.message || fallback);
};

const getHeaders = (headers = {}) => {
  const token = getStoredToken();
  const authHeaders = { ...headers };
  if (token) {
    authHeaders["Authorization"] = `Bearer ${token}`;
  }
  return authHeaders;
};

export const getBuyers = async (params = {}) => {
  const query = new URLSearchParams(params).toString();
  const url = query ? `${API_URL}?${query}` : API_URL;
  const response = await fetch(url, {
    headers: getHeaders(),
  });
  if (!response.ok) {
    throw new Error("Failed to fetch buyers");
  }
  return response.json();
};

export const getBuyer = async (id) => {
  const response = await fetch(`${API_URL}/${id}`, {
    headers: getHeaders(),
  });
  if (!response.ok) {
    throw new Error("Failed to fetch buyer details");
  }
  return response.json();
};

export const createBuyer = async (data) => {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: getHeaders({
      "Content-Type": "application/json",
    }),
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    await parseError(response, "Failed to create buyer");
  }
  return response.json();
};

export const updateBuyer = async (id, data) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: getHeaders({
      "Content-Type": "application/json",
    }),
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    await parseError(response, "Failed to update buyer");
  }
  return response.json();
};

export const deleteBuyer = async (id) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
    headers: getHeaders(),
  });
  if (!response.ok) {
    await parseError(response, "Failed to delete buyer");
  }
  return true;
};
