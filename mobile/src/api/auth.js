import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});


// Attach access token
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});


// Auto refresh token if expired
API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refresh = localStorage.getItem("refresh_token");

        const res = await axios.post(
          `${import.meta.env.VITE_API_URL}/auth/token/refresh/`,
          { refresh }
        );

        const newAccess = res.data.access;

        localStorage.setItem("access_token", newAccess);

        originalRequest.headers.Authorization = `Bearer ${newAccess}`;

        return API(originalRequest);
      } catch (err) {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");

        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);


// 🔹 Register user
export const register = (data) => {
  return API.post("/auth/register/", data);
};


// 🔹 Login user
export const login = async (data) => {
  const res = await API.post("/auth/login/", data);

  localStorage.setItem("access_token", res.data.access);
  localStorage.setItem("refresh_token", res.data.refresh);

  return res;
};


// 🔹 Get user profile
export const getProfile = () => {
  return API.get("/auth/me/");
};


// 🔹 Update profile
export const updateProfile = (data) => {
  return API.put("/auth/me/", data);
};


// 🔹 Change password
export const changePassword = (data) => {
  return API.post("/auth/change-password/", data);
};


export default API;