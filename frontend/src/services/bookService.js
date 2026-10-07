import api from "../api/axios";


export const getBooks = async (
  page = 1,
  pageSize = 10,
  search = ""
) => {
  const token = localStorage.getItem("authToken");

  const params = new URLSearchParams({
    page: page.toString(),
    page_size: pageSize.toString(),
  });

  if (search.trim()) {
    params.append("search", search.trim());
  }

  const response = await api.get(
    `/books/?${params.toString()}`,
    {
      headers: {
        Authorization: `Token ${token}`,
      },
    }
  );

  return response.data;
};


export const createBook = async (bookData) => {
  const token = localStorage.getItem("authToken");

  const response = await api.post(
    "/books/",
    bookData,
    {
      headers: {
        Authorization: `Token ${token}`,
      },
    }
  );

  return response.data;
};


export const getBook = async (bookId) => {
  const token = localStorage.getItem("authToken");

  const response = await api.get(
    `/books/${bookId}/`,
    {
      headers: {
        Authorization: `Token ${token}`,
      },
    }
  );

  return response.data;
};


export const updateBook = async (
  bookId,
  bookData
) => {
  const token = localStorage.getItem("authToken");

  const response = await api.put(
    `/books/${bookId}/`,
    bookData,
    {
      headers: {
        Authorization: `Token ${token}`,
      },
    }
  );

  return response.data;
};


export const getAvailableBooks = async (
  search = "",
  page = 1,
  pageSize = 100
) => {
  const token = localStorage.getItem("authToken");

  const params = new URLSearchParams({
    available: "true",
    page: page.toString(),
    page_size: pageSize.toString(),
  });

  if (search.trim()) {
    params.append(
      "search",
      search.trim()
    );
  }

  const response = await api.get(
    `/books/?${params.toString()}`,
    {
      headers: {
        Authorization: `Token ${token}`,
      },
    }
  );

  const data = response.data;

  return Array.isArray(data)
    ? data
    : data.results || [];
};