import axios, { AxiosInstance } from "axios"

export const api: AxiosInstance = axios.create({
  baseURL: "http://hioto.local:8000/api",
})

api.interceptors.response.use((res) => res.data)
