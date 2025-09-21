import axios from 'axios';
import type { RespuestaUserDto} from '../types/respuesta-user.dto';
import type { UpdateUserDto } from '../types/update-user.dto';
import { ForgotPasswordDto } from '../types/forgotPassword-dto';
const BASE_URL = import.meta.env.VITE_API_URL;
const USER_ENDPOINT = '/users';

export const getUserProfile = async (): Promise<RespuestaUserDto> => {
  try {
    const { data } = await axios.get<RespuestaUserDto>(USER_ENDPOINT);
    return data;
  } catch (error: any) {
    const msg = error.response?.data?.message || 'Error al obtener el perfil';
    throw new Error(msg);
  }
};

export const updateUserProfile = async (
  payload: UpdateUserDto
): Promise<RespuestaUserDto> => {
  try {
    const { data } = await axios.patch<RespuestaUserDto>(USER_ENDPOINT, payload);
    return data;
  } catch (error: any) {
    const msg = error.response?.data?.message || 'Error al actualizar el perfil';
    throw new Error(msg);
  }
};
export const forgotPassword = async (
  payload: ForgotPasswordDto
): Promise<{ message: string }> => {
  try {
    const { data } = await axios.post<{ message: string }>(
      `${BASE_URL}/users/forgot-password`,
      payload
    );
    return data;
  } catch (error: any) {
    const msg =
      error.response?.data?.message ||
      'Error al solicitar recuperación de contraseña';
    throw new Error(msg);
  }
};

export const resetPassword = async (
  token: string,
  newPassword: string
): Promise<{ message: string }> => {
  try {
    const { data } = await axios.post<{ message: string }>(
      `${BASE_URL}/users/reset-password`,
      { token, newPassword }
    );
    return data;
  } catch (error: any) {

    const msg = error.response?.data?.message || 'Error al restablecer contraseña';
    throw new Error(msg);
  }
};