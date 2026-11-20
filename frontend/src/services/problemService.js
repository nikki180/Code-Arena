import api from "../api/axios";

export const getAllProblems = async () => {
  const response = await api.get("/api/problems");
  return response.data;
};