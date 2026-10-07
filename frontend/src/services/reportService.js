import api from "../api/axios";


const getAuthHeaders = () => {
  const token = localStorage.getItem("authToken");

  return {
    Authorization: `Token ${token}`,
  };
};


export const getDashboardSummary = async () => {
  const response = await api.get(
    "/reports/dashboard/",
    {
      headers: getAuthHeaders(),
    }
  );

  return response.data;
};