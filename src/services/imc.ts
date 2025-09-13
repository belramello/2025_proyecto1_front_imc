import axios from "axios";
import { obtenerToken } from "../utils/storage";

export interface ImcPayload {
  altura: number;
  peso: number;
}

export interface ImcResult {
  imc: number;
  categoria: string;
}

export const calcularImc = async (payload: ImcPayload): Promise<ImcResult> => {
  const token = obtenerToken();
  console.log("Token enviado:", token); 

  if (!token) {
    throw new Error("No estás autenticado. Iniciá sesión primero.");
  }

  try {
    const { data } = await axios.post<ImcResult>(
      "http://localhost:3000/imc/calcular",
      payload,
      {
        headers: {
          Authorization: `${token}`, 
        },
      }
    );
    return data;
  } catch (error: any) {
    const msg = error.response?.data?.message || "Error al calcular el IMC.";
    throw new Error(msg);
  }
};
