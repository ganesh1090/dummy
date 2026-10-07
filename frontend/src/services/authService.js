import api from "../api/axios";

export const loginUser = async (username, password) => {
  const response = await api.post("/auth/login/", {
    username,
    password,
  });

  return response.data;
};




export const registerUser = async (
  username,
  email,
  password,
  passwordConfirm
) => {
  const response = await api.post("/auth/register/", {
    username,
    email,
    password,
    password_confirm: passwordConfirm,
  });

  return response.data;
};
export const logoutUser = async () => {
  const token = localStorage.getItem("authToken");

  const response = await api.post(
    "/auth/logout/",
    {},
    {
      headers: {
        Authorization: `Token ${token}`,
      },
    }
  );

  return response.data;
};
export const requestPasswordReset = async (email) => {
  const response = await api.post(
    "/auth/password-reset/",
    {
      email,
    }
  );

  return response.data;
};