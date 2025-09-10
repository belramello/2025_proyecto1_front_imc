import React, { useState } from "react";
import ImcError from "./ImcError";
import { calculateIMC } from "./services/imcService";
import { ImcResult } from "./interfaces/ImcResult";
import ImcResultBox from "./ImcResultBox";
import { InputField } from "./InputField";

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
      const data = await calculateIMC(alturaNum, pesoNum);
      setResultado(data);
      setError("");
    } catch (err: any) {
      setError(err.message || "Error inesperado al calcular el IMC.");
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
            <InputField
              label="Tu altura"
              value={altura}
              onChange={setAltura}
              unit="m"
              step="0.01"
              min="0.1"
              max="3"
            />
            <InputField
              label="Tu peso"
              value={peso}
              onChange={setPeso}
              unit="kg"
              min="1"
              max="500"
            />
            {error && <ImcError error={error} />}
            <button className="btn btn-primary w-100" type="submit">
              Calcular
            </button>
          </form>
        </div>
        <div className="right-panel p-4 text-center">
          {resultado ? (
            <ImcResultBox imc={resultado.imc} categoria={resultado.categoria} />
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
