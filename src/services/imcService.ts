import { ImcResult } from "../interfaces/ImcResult";
import { PaginatedHistorialResponse } from "../types/paginated-historial-response.dto";
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
    return data;
  } catch (error: any) {
    throw new Error(
      "Error al calcular el IMC. Verifica si el backend está corriendo."
    );
  }
};

export const getHistorialesPaginated = async (
  page: number,
  limit: number
): Promise<PaginatedHistorialResponse> => {
  try {
    const { data } = await api.get<PaginatedHistorialResponse>(
      `/historial/paginado?page=${page}&limit=${limit}`
    );
    return data;
  } catch (error: any) {
    throw new Error(
      "Error al cargar el historial paginado. Verifica tu sesión o con el equipo de backend."
    );
  }
};
