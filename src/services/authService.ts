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
    guardarToken(accessToken, refreshToken, user.nombre);
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
    const response = await api.post<{
      accessToken: string;
      refreshToken: string;
      user: RespuestaUserDto;
    }>("/auth/register", {
      nombre,
      email,
      contraseña,
    });
    const { accessToken, refreshToken, user } = response.data;
    if (!accessToken || !refreshToken || !user)
      throw new Error("Error al registrar");
    guardarToken(accessToken, refreshToken, user.nombre);
  } catch (error: any) {
    const msg = error.response?.data?.message;
    const status = error.response?.status;
    if (status === 409) throw new Error("El email ingresado ya está en uso");
    if (status === 400)
      throw new Error(
        Array.isArray(msg)
          ? msg.join(", ")
          : msg || "Los datos ingresados no son válidos"
      );
    throw new Error("Error al registrar");
  }
};

export const cerrarSesion = () => {
  try {
    eliminarTokens();
    window.location.href = "inicio-sesion";
  } catch (error) {
    console.error("Error al cerrar sesión");
  }
};
