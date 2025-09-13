import { RespuestaUserDto } from "../types/respuesta-user.dto";
import { eliminarTokens, guardarToken } from "../utils/storage";
import api from "./api";

export const login = async (email: string, contraseña: string) => {
  try {
    const response = await api.post<{
      accessToken: string;
      refreshToken: string;
      user: RespuestaUserDto;
    }>("/auth/login", { email, contraseña });

    const { accessToken, refreshToken, user } = response.data;
    guardarToken(accessToken, refreshToken);
    localStorage.setItem("nombreUsuario", user.nombre);
  } catch (error) {
    console.error("Error al iniciar sesión:", error);
    throw error;
  }
};

export const register = async (
  nombre: string,
  email: string,
  contraseña: string
) => {
  if (!nombre || !email || !contraseña) throw new Error("Faltan datos");

  try {
    const response = await api.post<{ access_token: string }>(
      "/auth/register",
      {
        nombre,
        email,
        contraseña,
      }
    );
    const { access_token } = response.data;
    if (!access_token) throw new Error("No se recibió token");
    guardarToken(access_token, null);
  } catch (error: any) {
    const msg = error.response?.data?.message;
    const status = error.response?.status;
    if (status === 409) throw new Error("Email ya registrado");
    if (status === 400)
      throw new Error(
        Array.isArray(msg) ? msg.join(", ") : msg || "Datos inválidos"
      );
    throw new Error("Error al registrar");
  }
};

export const cerrarSesion = () => {
  try {
    eliminarTokens();
    window.location.href = "iniciar-sesion";
  } catch (error) {
    console.error("Error al cerrar sesión");
  }
};
