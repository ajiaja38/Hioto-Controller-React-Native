import axios, { AxiosInstance } from "axios"

export const api: AxiosInstance = axios.create({
  baseURL: "https://hgx0rtj8-8000.asse.devtunnels.ms/api",
})

api.interceptors.response.use((res) => res.data)
