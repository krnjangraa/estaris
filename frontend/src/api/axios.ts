import axios from "axios";

const api = axios.create({
  baseURL: (import.meta.env.VITE_API_URL as string) || "/api/v1",

  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // If the URL has a leading slash and the baseURL is an absolute URL containing a subpath,
  // Axios will drop the subpath. Join them correctly to preserve /api/v1.
  if (config.url && config.url.startsWith("/") && config.baseURL && config.baseURL.startsWith("http")) {
    const cleanBaseURL = config.baseURL.endsWith("/") ? config.baseURL.slice(0, -1) : config.baseURL;
    config.url = cleanBaseURL + config.url;
    config.baseURL = ""; // Clear baseURL so Axios doesn't prepend it again
  }

  return config;
});


api.interceptors.response.use(
  (response) => response,

  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("admin");

      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default api;