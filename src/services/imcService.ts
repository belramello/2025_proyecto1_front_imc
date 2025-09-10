import axios from "axios";
import { ImcResult } from "../interfaces/ImcResult";

export const calculateIMC = async (
  altura: number,
  peso: number
): Promise<ImcResult> => {
  try {
    //url del back local: http://localhost:3000/imc/calcular
    const response = await axios.post<ImcResult>(
      "https://proyecto-1-backend.onrender.com/imc/calcular",
      {
        altura,
        peso,
      }
    );
    return response.data;
  } catch (error) {
    throw new Error(
      "Error al calcular el IMC. Verifica si el backend está corriendo."
    );
  }
};
