import axios  from "axios";

const API = axios.create({
  basseURL: "http://10.129.52.220:8000/api",
}); 

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config; 
}); 
export const getProfile = () => API.get("/auth/profile/");