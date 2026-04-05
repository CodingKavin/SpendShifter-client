import axios, { type InternalAxiosRequestConfig } from "axios";
import { supabase } from "./supabase";

const apiUrl = import.meta.env.VITE_API_BASE_URL!;

if(!apiUrl) throw new Error("VITE_API_BASE_URL is not defined in the env variables")

const api = axios.create({
  baseURL: apiUrl,
});

api.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
  const { data: { session } } = await supabase.auth.getSession();

  const token = session?.access_token;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;