import { getStoredToken } from "./auth";

const API_URL = `${import.meta.env.VITE_API_URL}/ai`;

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

/**
 * Fetch AI insights for a specific batch.
 * @param {Object} params
 * @param {number|string} params.batchId - The database ID of the batch
 * @param {string} params.mode - Analysis mode ('botanical' | 'formulation' | 'optimization')
 * @param {string} [params.customQuery] - Optional custom user question
 * @returns {Promise<Object>} The AI insights JSON response
 */
export const getBatchInsights = async ({ batchId, mode, customQuery }) => {
  const response = await fetch(`${API_URL}/insights`, {
    method: "POST",
    headers: getHeaders({
      "Content-Type": "application/json",
    }),
    body: JSON.stringify({ batchId, mode, customQuery }),
  });

  if (!response.ok) {
    await parseError(response, "Failed to generate AI insights");
  }

  return response.json();
};
