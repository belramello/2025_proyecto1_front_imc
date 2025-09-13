import { ImcPayload } from "../interfaces/ImcPayload";
import { ImcResult } from "../interfaces/ImcResult";
import api from "./api";

export const calcularImc = async (payload: ImcPayload): Promise<ImcResult> => {
  try {
    //url del back desplegado: https://proyecto-1-backend.onrender.com/imc/calcular
    const { data } = await api.post<ImcResult>("/imc/calcular", payload);

    console.log("data");
    return data;
  } catch (error: any) {
    throw new Error(
      "Error al calcular el IMC. Verifica si el backend está corriendo."
    );
  }
};
