import { api } from "./api";
import { guardarToken} from "../utils/storage";

export const login = async (email: string, contraseña: string) => {
  try {
        const response = await api.post("/auth/login", { email, contraseña });
        console.log("Login response:", response);
        const { accessToken, refreshToken, user } = response;
        guardarToken(accessToken, refreshToken);
        localStorage.setItem("nombreUsuario", user.nombre);
        return { accessToken, refreshToken, user };
    } catch (error) {
        console.error("Error al iniciar sesión:", error);
        throw error;
    }
};

export const register = async (nombre: string, email: string, contraseña: string) => {
  if (!nombre || !email || !contraseña) throw new Error("Faltan datos");

  try {
        const { access_token } = await api.post("/auth/register", { nombre, email, contraseña });
        if (!access_token) throw new Error("No se recibió token");
        guardarToken(access_token, null);
        return { success: true, access_token };
    } catch (error: any) {
        const msg = error.response?.data?.message;
        const status = error.response?.status;
        if (status === 409) throw new Error("Email ya registrado");
        if (status === 400) throw new Error(Array.isArray(msg) ? msg.join(', ') : msg || "Datos inválidos");
        throw new Error("Error al registrar");
    }
};

export const cerrarSesion = () => {
  api.logout();
};
