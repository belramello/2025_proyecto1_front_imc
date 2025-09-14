import { Calculation } from "../interfaces/Calculation";
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


export const getHistory = async (): Promise<Calculation[]> => {
  try {
    const { data } = await api.get<Calculation[]>("/historial");
    console.log("data historial", data);
    return data;
  } catch (error: any) {
    throw new Error(
      "Error al cargar el historial. Verifica tu sesión o con el equipo de backend."
    );
  }
};