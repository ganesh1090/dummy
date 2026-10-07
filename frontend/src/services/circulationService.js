import api from "../api/axios";


const getAuthHeaders = () => {
  const token = localStorage.getItem("authToken");

  return {
    Authorization: `Token ${token}`,
  };
};


export const getCirculationRecords = async (
  page = 1,
  pageSize = 10
) => {
  const response = await api.get(
    `/circulation/issued/?page=${page}&page_size=${pageSize}`,
    {
      headers: getAuthHeaders(),
    }
  );

  return {
    ...response.data,
    totalCount: response.data.count ?? 0,
  };
};


export const issueBook = async (
  bookId,
  memberId,
  loanDays = 14,
  notes = ""
) => {
  const response = await api.post(
    "/circulation/issue/",
    {
      book: bookId,
      member: memberId,
      loan_days: Number(loanDays),
      notes,
    },
    {
      headers: getAuthHeaders(),
    }
  );

  return response.data;
};


export const returnBook = async (
  issueId
) => {
  const response = await api.post(
    `/circulation/return/${issueId}/`,
    {},
    {
      headers: getAuthHeaders(),
    }
  );

  return response.data;
};


export const getCirculationRecord = async (
  issueId
) => {
  const response = await api.get(
    `/circulation/issued/${issueId}/`,
    {
      headers: getAuthHeaders(),
    }
  );

  return response.data;
};