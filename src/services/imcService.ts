import { ImcResult } from "../interfaces/ImcResult";
import api from "./api";

export const calcularImc = async (
  altura: number,
  peso: number
): Promise<ImcResult> => {
  try {
    const { data } = await api.post<ImcResult>("/imc/calcular", {
      altura,
      peso,
    });

    console.log("data");
    return data;
  } catch (error: any) {
    throw new Error(
      "Error al calcular el IMC. Verifica si el backend está corriendo."
    );
  }
};
