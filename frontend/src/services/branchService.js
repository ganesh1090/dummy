import api from "../api/axios";


export const getBranches = async () => {
  const token = localStorage.getItem("authToken");

  const response = await api.get(
    "/branches/",
    {
      headers: {
        Authorization: `Token ${token}`,
      },
    }
  );

  return response.data;
};


export const createBranch = async (
  branchData
) => {
  const token = localStorage.getItem("authToken");

  const response = await api.post(
    "/branches/",
    branchData,
    {
      headers: {
        Authorization: `Token ${token}`,
      },
    }
  );

  return response.data;
};


export const getBranch = async (
  branchId
) => {
  const token = localStorage.getItem("authToken");

  const response = await api.get(
    `/branches/${branchId}/`,
    {
      headers: {
        Authorization: `Token ${token}`,
      },
    }
  );

  return response.data;
};


export const updateBranch = async (
  branchId,
  branchData
) => {
  const token = localStorage.getItem("authToken");

  const response = await api.put(
    `/branches/${branchId}/`,
    branchData,
    {
      headers: {
        Authorization: `Token ${token}`,
      },
    }
  );

  return response.data;
};


export const deleteBranch = async (
  branchId
) => {
  const token = localStorage.getItem("authToken");

  const response = await api.delete(
    `/branches/${branchId}/`,
    {
      headers: {
        Authorization: `Token ${token}`,
      },
    }
  );

  return response.data;
};