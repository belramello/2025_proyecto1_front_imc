import { ForgotPasswordDto } from "../types/forgot-password-dto";
import { ResetPasswordDto } from "../types/reset-password-dto";
import api from "./api";

export const forgotPassword = async (payload: ForgotPasswordDto) => {
  try {
    return await api.post(`/users/forgot-password`, payload);
  } catch (error: any) {
    const msg =
      error.response?.data?.message ||
      "Error al solicitar recuperación de contraseña";
    throw new Error(msg);
  }
};

export const resetPassword = async (resetPasswordDto: ResetPasswordDto) => {
  try {
    return await api.post<void>(`/users/reset-password`, {
      token: resetPasswordDto.token,
      newPassword: resetPasswordDto.newPassword,
    });
  } catch (error: any) {
    const msg =
      error.response?.data?.message || "Error al restablecer contraseña";
    throw new Error(msg);
  }
};
