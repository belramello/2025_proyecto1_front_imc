import axios from 'axios';
import type { RespuestaUserDto} from '../types/respuesta-user.dto';
import type { UpdateUserDto } from '../types/update-user.dto';

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
