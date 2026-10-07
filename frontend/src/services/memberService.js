import api from "../api/axios";


export const getMembers = async (
  page = 1,
  pageSize = 10
) => {
  const token = localStorage.getItem("authToken");

  const response = await api.get(
    `/members/?page=${page}&page_size=${pageSize}`,
    {
      headers: {
        Authorization: `Token ${token}`,
      },
    }
  );

  return response.data;
};


export const createMember = async (
  memberData
) => {
  const token = localStorage.getItem("authToken");

  const response = await api.post(
    "/members/",
    memberData,
    {
      headers: {
        Authorization: `Token ${token}`,
      },
    }
  );

  return response.data;
};


export const getMember = async (
  memberId
) => {
  const token = localStorage.getItem("authToken");

  const response = await api.get(
    `/members/${memberId}/`,
    {
      headers: {
        Authorization: `Token ${token}`,
      },
    }
  );

  return response.data;
};


export const updateMember = async (
  memberId,
  memberData
) => {
  const token = localStorage.getItem("authToken");

  const response = await api.put(
    `/members/${memberId}/`,
    memberData,
    {
      headers: {
        Authorization: `Token ${token}`,
      },
    }
  );

  return response.data;
};


export const deleteMember = async (
  memberId
) => {
  const token = localStorage.getItem("authToken");

  const response = await api.delete(
    `/members/${memberId}/`,
    {
      headers: {
        Authorization: `Token ${token}`,
      },
    }
  );

  return response.data;
};
export const getActiveMembers = async () => {
  const token = localStorage.getItem("authToken");

  const response = await api.get(
    "/members/?page=1&page_size=100",
    {
      headers: {
        Authorization: `Token ${token}`,
      },
    }
  );

  const data = response.data;

  // DRF paginated response
  const members = Array.isArray(data)
    ? data
    : data.results || [];

  return members.filter((member) => member.is_active);
};