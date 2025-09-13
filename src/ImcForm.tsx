import React, { useState } from "react";
import ImcError from "./components/ImcError";
import Navbar from "./components/NavBar";
import ImcResultBox from "./components/ImcResultBox";
import { ImcResult } from "./interfaces/ImcResult";
import { calcularImc } from "./services/imcService";
import { InputField } from "./components/InputField";

function ImcForm() {
  const [altura, setAltura] = useState("");
  const [peso, setPeso] = useState("");
  const [resultado, setResultado] = useState<ImcResult | null>(null);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setResultado(null);

    const alturaNum = parseFloat(altura);
    const pesoNum = parseFloat(peso);

    if (isNaN(alturaNum) || isNaN(pesoNum) || alturaNum <= 0 || pesoNum <= 0) {
      setError("Por favor, ingresa valores válidos (positivos y numéricos).");
      return;
    }

    try {
      const result = await calcularImc({ altura: alturaNum, peso: pesoNum });
      setResultado(result);
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <>
      <Navbar />
      <div
        className="main-bg-color d-flex flex-column align-items-center justify-content-center"
        style={{ height: "calc(100vh - 56px)" }}
      >
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
              <ImcResultBox
                imc={resultado.imc}
                categoria={resultado.categoria}
              />
            ) : (
              <div className="text-center text-muted">
                <p>Introduce tus datos para ver el resultado aquí.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default ImcForm;
