import api from "../api/axios";


const getAuthHeaders = () => {
  const token = localStorage.getItem("authToken");

  return {
    Authorization: `Token ${token}`,
  };
};


// Get OPAC catalogue
export const getOPAC = async (params = {}) => {
  const response = await api.get(
    "/opac/",
    {
      params,
      headers: getAuthHeaders(),
    }
  );

  return response.data;
};


// Get single OPAC title
export const getOPACTitle = async (titleId) => {
  const response = await api.get(
    `/opac/${titleId}/`,
    {
      headers: getAuthHeaders(),
    }
  );

  return response.data;
};