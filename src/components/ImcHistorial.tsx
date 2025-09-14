import React, { useState, useEffect } from 'react';
import { getHistory } from '../services/imcService';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Calculation } from '../interfaces/Calculation';
import Navbar from './NavBar';

const History: React.FC = () => {
  const [calculations, setCalculations] = useState<Calculation[]>([]);
  const [filteredCalculations, setFilteredCalculations] = useState<Calculation[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  const fetchCalculations = async () => {
    try {
      const data = await getHistory(); 
      const sortedData = data.sort((a, b) =>
        new Date(b.fechaHora).getTime() - new Date(a.fechaHora).getTime()
      );
      setCalculations(sortedData);
      setFilteredCalculations(sortedData); 
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar el historial.');
      setCalculations([]);
      setFilteredCalculations([]);
    }
  };

  useEffect(() => {
    fetchCalculations();
  }, []);

  const handleFilter = () => {
    const start = startDate ? new Date(startDate + 'T00:00:00Z') : null;
    let end = endDate ? new Date(endDate + 'T23:59:59.999Z') : null;

    const filtered = calculations.filter((calc) => {
      const calcDate = new Date(calc.fechaHora);
      return (
        (!start || calcDate >= start) &&
        (!end || calcDate <= end)
      );
    });

    setFilteredCalculations(filtered);
  };

  return (
    <>
      <Navbar />
      <div className="main-bg-color min-vh-100 d-flex flex-column align-items-center justify-content-center">
        <div className="text-center text-white mb-4">
          <h1 className="fw-bold fs-2">Historial de Cálculos de IMC</h1>
        </div>
        <div className="card-container shadow-lg d-flex mb-4">
          <div className="p-4 w-100 text-center">
            <div className="mb-3">
              <label className="text-white me-2">Desde:</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="form-control d-inline-block w-auto"
              />
              <label className="text-white mx-2">Hasta:</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="form-control d-inline-block w-auto"
              />
              <button
                className="btn btn-primary ms-2"
                onClick={handleFilter}
              >
                Filtrar
              </button>
            </div>
            {error && <div className="alert alert-danger">{error}</div>}
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
                {filteredCalculations.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center text-muted">
                      No hay cálculos registrados para este usuario o en el rango seleccionado.
                    </td>
                  </tr>
                ) : (
                  filteredCalculations.map((calc) => (
                    <tr key={calc.id}>
                      <td>{new Date(calc.fechaHora).toLocaleString()}</td>
                      <td>{calc.peso}</td>
                      <td>{calc.altura}</td>
                      <td>{calc.imc.toFixed(2)}</td>
                      <td>
                        <span className={getCategoriaColor(calc.categoria)}>
                          {calc.categoria}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

function getCategoriaColor(categoria: string) {
  switch (categoria.toLowerCase()) {
    case 'obeso':
    case 'sobrepeso':
      return 'text-danger';
    case 'normal':
      return 'text-success';
    case 'bajo peso':
      return 'text-warning';
    default:
      return '';
  }
}

export default History;