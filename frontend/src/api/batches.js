import { getStoredToken } from "./auth";

const API_URL = `${import.meta.env.VITE_API_URL}/batches`;

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

export const getBatches = async () => {
  const response = await fetch(API_URL, {
    headers: getHeaders(),
  });
  if (!response.ok) {
    throw new Error("Failed to fetch batches");
  }
  return response.json();
};

export const getBatch = async (id) => {
  const response = await fetch(`${API_URL}/${id}`, {
    headers: getHeaders(),
  });

  if (!response.ok) {
    throw new Error("Failed to fetch batch");
  }

  return response.json();
};

export const createBatch = async (data) => {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: getHeaders({
      "Content-Type": "application/json",
    }),
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    await parseError(response, "Failed to create batch");
  }
  return response.json();
};

export const updateBatch = async (id, data) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: getHeaders({
      "Content-Type": "application/json",
    }),
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    await parseError(response, "Failed to update batch");
  }
  return response.json();
};

export const deleteBatch = async (id) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
    headers: getHeaders(),
  });
  if (!response.ok) {
    await parseError(response, "Failed to delete batch");
  }
  return true;
};