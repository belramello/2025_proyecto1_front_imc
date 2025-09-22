import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { HistorialDTO } from "../interfaces/historial-dto";
import { getHistorialesPaginated } from "../services/imcService";
import ImcError from "./ImcError";
import Pagination from "./Pagination";

const Historial: React.FC = () => {
  const [historiales, setHistoriales] = useState<HistorialDTO[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const [page, setPage] = useState(1);
  const [limit] = useState(5);
  const [totalPages, setTotalPages] = useState(1);

  const fetchHistorial = async (pageNumber: number) => {
    setLoading(true);
    try {
      const data = await getHistorialesPaginated(pageNumber, limit);
      setHistoriales(data.historiales);
      setTotalPages(data.lastPage);
      setError(null);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error al cargar el historial."
      );
      setHistoriales([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistorial(page);
  }, [page]);

  function formatFechaArgentina(fecha: string | Date) {
    const date = new Date(fecha);
    date.setHours(date.getHours() - 3); // restar 3 horas
    return date.toLocaleString("es-AR", {
      hour12: false, //
    });
  }
  return (
    <div className="main-bg-color min-vh-100">
      <div className="container pt-5">
        <div className="text-center text-white mb-4">
          <h1 className="fw-bold fs-2">Historial de Cálculos de IMC</h1>
        </div>

        <div className="card shadow-lg mb-4">
          <div className="card-body">
            {error && <ImcError error={error} />}
            {loading ? (
              <div className="d-flex justify-content-center">
                <div className="spinner-border text-primary" role="status">
                  <span className="sr-only"></span>
                </div>
              </div>
            ) : (
              <>
                <div className="table-responsive">
                  <table className="table table-striped align-middle">
                    <thead>
                      <tr>
                        <th>Fecha</th>
                        <th>Peso (kg)</th>
                        <th>Altura (m)</th>
                        <th>IMC</th>
                        <th>Categoría</th>
                      </tr>
                    </thead>
                    <tbody>
                      {historiales.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="text-center text-muted">
                            No hay cálculos registrados para este usuario.
                          </td>
                        </tr>
                      ) : (
                        historiales.map((historial) => (
                          <tr key={historial.id}>
                            <td>
                              <td>
                                {formatFechaArgentina(historial.fechaHora)}
                              </td>
                            </td>
                            <td>{historial.peso}</td>
                            <td>{historial.altura}</td>
                            <td>{historial.imc.toFixed(2)}</td>
                            <td>
                              <span
                                className={getCategoriaColor(
                                  historial.categoria
                                )}
                              >
                                {historial.categoria}
                              </span>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                <div className="d-flex justify-content-center mt-3">
                  <Pagination
                    currentPage={page}
                    totalPages={totalPages}
                    onPageChange={setPage}
                  />
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

function getCategoriaColor(categoria: string) {
  switch (categoria.toLowerCase()) {
    case "obeso":
    case "sobrepeso":
      return "text-danger fw-bold";
    case "normal":
      return "text-success fw-bold";
    case "bajo peso":
      return "text-warning fw-bold";
    default:
      return "fw-bold";
  }
}

export default Historial;
