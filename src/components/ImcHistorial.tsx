import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { HistorialDTO } from "../interfaces/historial-dto";
import { getHistoriales } from "../services/imcService";
import ImcError from "./ImcError";
import Pagination from "./Pagination";

const Historial: React.FC = () => {
  const [historiales, setHistoriales] = useState<HistorialDTO[]>([]);
  const [filteredHistoriales, setFilteredHistoriales] = useState<HistorialDTO[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  const [page, setPage] = useState(1);
  const [limit] = useState(5);
  const [totalPages, setTotalPages] = useState(1);

  const fetchHistorial = async () => {
    try {
      const data = await getHistoriales();
      setHistoriales(data);
      setFilteredHistoriales(data);
      setTotalPages(Math.ceil(data.length / limit));
      setError(null);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error al cargar el historial."
      );
      setHistoriales([]);
      setFilteredHistoriales([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistorial();
  }, []);

  const handleFilter = () => {
    const start = startDate ? new Date(startDate + "T00:00:00Z") : null;
    const end = endDate ? new Date(endDate + "T23:59:59.999Z") : null;

    const filtered = historiales.filter((historial) => {
      const calcDate = new Date(historial.fechaHora);
      return (!start || calcDate >= start) && (!end || calcDate <= end);
    });

    setFilteredHistoriales(filtered);
    setPage(1);
    setTotalPages(Math.ceil(filtered.length / limit));
  };

  const paginatedFiltered = filteredHistoriales.slice(
    (page - 1) * limit,
    page * limit
  );

  return (
    <>
      <div className="main-bg-color min-vh-100 d-flex flex-column align-items-center justify-content-center">
        <div className="text-center text-white mb-4">
          <h1 className="fw-bold fs-2">Historial de Cálculos de IMC</h1>
        </div>
        <div className="card-container shadow-lg d-flex mb-4">
          <div className="p-4 w-100 text-center">
            <div className="mb-2 ">
              <label className="text-dark-blue me-2">Desde:</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="form-control d-inline-block w-auto"
              />
              <label className="ms-3 text-dark-blue me-2">Hasta:</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="form-control d-inline-block w-auto"
              />
              <button className="btn btn-primary ms-2" onClick={handleFilter}>
                Filtrar
              </button>
            </div>
            {error && <ImcError error={error} />}
            {loading ? (
              <div className="spinner-border text-primary" role="status">
                <span className="sr-only"></span>
              </div>
            ) : (
              <>
                <table className="table table-striped">
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
                    {!loading && paginatedFiltered.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="text-center text-muted">
                          No hay cálculos registrados para este usuario o en el
                          rango seleccionado.
                        </td>
                      </tr>
                    ) : (
                      paginatedFiltered.map((historial) => (
                        <tr key={historial.id}>
                          <td>
                            {new Date(historial.fechaHora).toLocaleString(
                              "es-AR",
                              { timeZone: "UTC" }
                            )}
                          </td>
                          <td>{historial.peso}</td>
                          <td>{historial.altura}</td>
                          <td>{historial.imc.toFixed(2)}</td>
                          <td>
                            <span className={getCategoriaColor(historial.categoria)}>
                              {historial.categoria}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
                <Pagination
                  currentPage={page}
                  totalPages={totalPages}
                  onPageChange={setPage}
                />
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

function getCategoriaColor(categoria: string) {
  switch (categoria.toLowerCase()) {
    case "obeso":
    case "sobrepeso":
      return "text-danger";
    case "normal":
      return "text-success";
    case "bajo peso":
      return "text-warning";
    default:
      return "";
  }
}

export default Historial;
