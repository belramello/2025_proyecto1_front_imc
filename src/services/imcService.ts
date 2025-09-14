import { HistorialDTO } from "../interfaces/historial-dto";
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

export const getHistoriales = async (): Promise<HistorialDTO[]> => {
  try {
    const { data } = await api.get<HistorialDTO[]>("/historial");
    return data;
  } catch (error: any) {
    throw new Error(
      "Error al cargar el historial. Verifica tu sesión o con el equipo de backend."
    );
  }
};
