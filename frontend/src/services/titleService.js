import api from "../api/axios";


const getAuthHeaders = () => {
  const token = localStorage.getItem("authToken");

  return {
    Authorization: `Token ${token}`,
  };
};


export const getTitles = async () => {
  const response = await api.get(
    "/titles/",
    {
      headers: getAuthHeaders(),
    }
  );

  return response.data;
};


export const getTitle = async (
  titleId
) => {
  const response = await api.get(
    `/titles/${titleId}/`,
    {
      headers: getAuthHeaders(),
    }
  );

  return response.data;
};


export const createTitle = async (
  titleData
) => {
  const response = await api.post(
    "/titles/",
    titleData,
    {
      headers: getAuthHeaders(),
    }
  );

  return response.data;
};


export const updateTitle = async (
  titleId,
  titleData
) => {
  const response = await api.put(
    `/titles/${titleId}/`,
    titleData,
    {
      headers: getAuthHeaders(),
    }
  );

  return response.data;
};


export const deleteTitle = async (
  titleId
) => {
  const response = await api.delete(
    `/titles/${titleId}/`,
    {
      headers: getAuthHeaders(),
    }
  );

  return response.data;
};