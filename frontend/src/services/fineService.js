import api from "../api/axios";


const getAuthHeaders = () => {
  const token = localStorage.getItem("authToken");

  return {
    Authorization: `Token ${token}`,
  };
};


export const getFines = async (
  page = 1,
  pageSize = 10
) => {
  const response = await api.get(
    `/fines/?page=${page}&page_size=${pageSize}`,
    {
      headers: getAuthHeaders(),
    }
  );

  return response.data;
};


export const getFine = async (fineId) => {
  const response = await api.get(
    `/fines/${fineId}/`,
    {
      headers: getAuthHeaders(),
    }
  );

  return response.data;
};


export const createFine = async (
  issueId,
  reason = "Late return"
) => {
  const response = await api.post(
    "/fines/create/",
    {
      issue: issueId,
      reason,
    },
    {
      headers: getAuthHeaders(),
    }
  );

  return response.data;
};


export const payFine = async (fineId) => {
  const response = await api.post(
    `/fines/${fineId}/pay/`,
    {},
    {
      headers: getAuthHeaders(),
    }
  );

  return response.data;
};