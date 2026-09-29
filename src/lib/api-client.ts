import { ofetch } from "ofetch";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const apiClient = ofetch.create({
  credentials: "include",

  baseURL: API_BASE_URL,
});

export default apiClient;
