import {
  eliminarTokens,
  guardarToken,
  obtenerRefreshToken,
  obtenerToken,
} from "../utils/storage";
import axios from "axios";

//url del back desplegado: https://proyecto-1-backend.onrender.com
//url local http://localhost:3000
const api = axios.create({
  baseURL: "https://proyecto-1-backend.onrender.com",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config: any) => {
  const token = obtenerToken();
  if (token && config.headers) {
    config.headers["Authorization"] = token;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error: any) => {
    if (error.response?.status === 401) {
      const refresh_token = obtenerRefreshToken();
      if (refresh_token) {
        console.log("tengo refresh token");
        try {
          const response = await axios.post(
            `${api.defaults.baseURL}/auth/refresh`,
            { refreshToken: refresh_token },
            { headers: { "Content-Type": "application/json" } }
          );
          const { accessToken, refreshToken } = response.data as {
            accessToken: string;
            refreshToken: string;
          };
          guardarToken(accessToken, refreshToken || null);

          if (error.config) {
            error.config.headers = error.config.headers || {};
            error.config.headers["Authorization"] = accessToken;
            return axios(error.config);
          }
        } catch (refreshError) {
          eliminarTokens();
          window.location.href = "/iniciar-sesion";
          return Promise.reject(refreshError);
        }
      } else {
        eliminarTokens();
        window.location.href = "/iniciar-sesion";
      }
    }
    return Promise.reject(error);
  }
);

export default api;
