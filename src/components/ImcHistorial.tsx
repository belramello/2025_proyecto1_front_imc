import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { HistorialDTO } from "../interfaces/historial-dto";
import { getHistoriales } from "../services/imcService";
import ImcError from "./ImcError";

const Historial: React.FC = () => {
  const [historiales, setHistoriales] = useState<HistorialDTO[]>([]);
  const [filteredHistoriales, setFilteredHistoriales] = useState<
    HistorialDTO[]
  >([]);
  const [error, setError] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  const fetchHistorial = async () => {
    try {
      const data = await getHistoriales();
      setHistoriales(data);
      setFilteredHistoriales(data);
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

  //filtra los historiales de acuerdo a las fechas de inicio y fin seleccionadas.
  const handleFilter = () => {
    const start = startDate ? new Date(startDate + "T00:00:00Z") : null;
    let end = endDate ? new Date(endDate + "T23:59:59.999Z") : null;
    const filtered = historiales.filter((historial) => {
      const calcDate = new Date(historial.fechaHora);
      return (!start || calcDate >= start) && (!end || calcDate <= end);
    });

    setFilteredHistoriales(filtered);
  };

  return (
    <>
      <div className="main-bg-color min-vh-100 d-flex flex-column align-items-center justify-content-center pt-5 mt-5">
        <div className="text-center text-white mb-4">
          <h1 className="fw-bold fs-2">Historial de Cálculos de IMC</h1>
        </div>
        <div className="card-container shadow-lg d-flex mb-4">
          <div className="p-4 w-100 text-center">
            <div className="mb-3 row g-2 justify-content-center">
              <div className="col-12 col-md-auto">
                <label className="text-dark-blue me-2">Desde:</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="form-control"
                />
              </div>
              <div className="col-12 col-md-auto">
                <label className="text-dark-blue me-2">Hasta:</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="form-control"
                />
              </div>
              <div className="col-12 col-md-auto d-flex align-items-end">
                <button
                  className="btn btn-primary w-100"
                  onClick={handleFilter}
                >
                  Filtrar
                </button>
              </div>
            </div>

            {error && <ImcError error={error} />}

            {loading ? (
              <div className="spinner-border text-primary" role="status">
                <span className="sr-only"></span>
              </div>
            ) : (
              <div className="table-responsive">
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
                    {!loading && filteredHistoriales.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="text-center text-muted">
                          No hay cálculos registrados para este usuario o en el
                          rango seleccionado.
                        </td>
                      </tr>
                    ) : (
                      filteredHistoriales.map((historial) => (
                        <tr key={historial.id}>
                          <td>
                            {new Date(historial.fechaHora).toLocaleString(
                              "es-AR",
                              {
                                timeZone: "UTC",
                              }
                            )}
                          </td>
                          <td>{historial.peso}</td>
                          <td>{historial.altura}</td>
                          <td>{historial.imc.toFixed(2)}</td>
                          <td>
                            <span
                              className={getCategoriaColor(historial.categoria)}
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
