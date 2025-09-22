import { HistorialDTO } from "../interfaces/historial-dto";

export interface PaginatedHistorialResponse {
  historiales: HistorialDTO[];
  total: number;
  page: number;
  lastPage: number;
}
