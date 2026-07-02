const API_URL = "http://localhost:5000/api/batches";

export const getBatches = async () => {
  const response = await fetch(API_URL);

  if (!response.ok) {
    throw new Error("Failed to fetch batches");
  }

  return response.json();
}; 