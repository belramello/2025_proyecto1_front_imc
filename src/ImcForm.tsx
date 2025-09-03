import axios from "axios";
import React, { useState } from "react";
import ImcResult from "./ImcResult";
import ImcError from "./ImcError";

interface ImcResult {
  imc: number;
  categoria: string;
}

function ImcForm() {
  const [altura, setAltura] = useState("");
  const [peso, setPeso] = useState("");
  const [resultado, setResultado] = useState<ImcResult | null>(null);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const alturaNum = parseFloat(altura);
    const pesoNum = parseFloat(peso);

    if (isNaN(alturaNum) || isNaN(pesoNum) || alturaNum <= 0 || pesoNum <= 0) {
      setError("Por favor, ingresa valores válidos (positivos y numéricos).");
      setResultado(null);
      return;
    }

    try {
      const response = await axios.post("https://two025-proyecto1-back-imc.onrender.com/imc/calcular", {
        altura: alturaNum,
        peso: pesoNum,
      });
      setResultado(response.data);
      setError("");
    } catch (err) {
      setError(
        "Error al calcular el IMC. Verifica si el backend está corriendo."
      );
      setResultado(null);
    }
  };

  return (
    <div className="main-bg-color min-vh-100 d-flex flex-column align-items-center justify-content-center">
      <div className="text-center text-white mb-4">
        <h1 className="fw-bold fs-2">
          Calcula tu Índice de Masa Corporal (IMC)
        </h1>
        <p className="opacity-75">
          Tu IMC puede ser una medida inicial útil para identificar tu
          clasificación de peso.
        </p>
      </div>
      <div className="card-container shadow-lg d-flex">
        <div className="left-panel">
          <form onSubmit={handleSubmit}>
            <div className="form-group mb-4">
              <label className="form-label text-dark-blue">TU ALTURA</label>
              <div className="d-flex align-items-center">
                <input
                  type="number"
                  className="form-control"
                  value={altura}
                  onChange={(e) => setAltura(e.target.value)}
                  step="0.01"
                  min="0.1"
                />
                <span className="unit-label ms-2">m</span>
              </div>
            </div>
            <div className="form-group mb-4">
              <label className="form-label text-dark-blue">TU PESO</label>
              <div className="d-flex align-items-center">
                <input
                  type="number"
                  className="form-control"
                  value={peso}
                  onChange={(e) => setPeso(e.target.value)}
                  min="1"
                />
                <span className="unit-label ms-2">kg</span>
              </div>
            </div>
            {error && <ImcError error={error} />}
            <button className="btn btn-primary w-100" type="submit">
              Calcular
            </button>
          </form>
        </div>
        <div className="right-panel p-4 text-center">
          {resultado ? (
            <ImcResult imc={resultado.imc} categoria={resultado.categoria} />
          ) : (
            <div className="text-center text-muted">
              <p>Introduce tus datos para ver el resultado aquí.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ImcForm;
