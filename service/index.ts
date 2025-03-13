import axios, { AxiosInstance } from "axios";

export const api: AxiosInstance = axios.create({
  baseURL: "http://192.168.4.22:8000/api",
});

api.interceptors.response.use((res) => res.data);
