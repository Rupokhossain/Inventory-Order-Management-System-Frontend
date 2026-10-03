import { ofetch } from "ofetch";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api/v1";

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp("(^|;\\s*)(" + name + ")=([^;]*)"));
  return match ? decodeURIComponent(match[3]) : null;
}

export const apiClient = ofetch.create({
  baseURL: API_BASE_URL,
  credentials: "include",
  onRequest({ options }) {
    const token = getCookie("accessToken");
    if (token) {
      const headers = new Headers(options.headers);
      headers.set("Authorization", `Bearer ${token}`);
      options.headers = headers;
    }
  },
  onResponseError({ response }) {
    const serverMessage =
      response._data?.message || response._data?.error || response.statusText;
    if (serverMessage) {
      const error: any = new Error(serverMessage);
      error.data = response._data;
      error.status = response.status;
      throw error;
    }
  },
});

export default apiClient;
