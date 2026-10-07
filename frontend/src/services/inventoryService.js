import api from "../api/axios";


const getAuthHeaders = () => {
  const token = localStorage.getItem("authToken");

  return {
    Authorization: `Token ${token}`,
  };
};


export const getInventory = async (
  page = 1,
  pageSize = 10
) => {
  const response = await api.get(
    `/inventory/?page=${page}&page_size=${pageSize}`,
    {
      headers: getAuthHeaders(),
    }
  );

  return response.data;
};


export const getInventoryItem = async (
  inventoryId
) => {
  const response = await api.get(
    `/inventory/${inventoryId}/`,
    {
      headers: getAuthHeaders(),
    }
  );

  return response.data;
};


export const updateInventory = async (
  inventoryId,
  inventoryData
) => {
  const response = await api.put(
    `/inventory/${inventoryId}/`,
    inventoryData,
    {
      headers: getAuthHeaders(),
    }
  );

  return response.data;
};