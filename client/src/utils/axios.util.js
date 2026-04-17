import axios from "axios";
import { API_URL } from "../constants/env.constants";

const API = axios.create({
  baseURL: API_URL,
  withCredentials: true, 
});

let accessToken = null;

export const setAccessToken = (token) => {
  accessToken = token;
};

// set accesstoken to every request -> otherwise we will have to login again and again 
API.interceptors.request.use((config) => {
  console.log("acess token sent",accessToken);
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

// if we encounter 401 for the first time , we try to refresh the token and if that fails too then sikmply send to login page
API.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;
    console.log('refrsh called');
    if (error.response?.status === 401 && !originalRequest._retry && !originalRequest.url.includes("/auth/refresh")) {
      originalRequest._retry = true;

      try {
        console.log('refrsh called response',response);
        const response = await axios.post(`${API_URL}/api/auth/refresh`,{},{withCredentials:true});
        const {newAccessToken} = response.data;

        setAccessToken(newAccessToken);

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        return API(originalRequest);
      } catch (err) {
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default API;