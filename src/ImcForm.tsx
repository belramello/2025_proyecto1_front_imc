import React, { useState } from "react";
import ImcError from "./components/ImcError";
import ImcResultBox from "./components/ImcResultBox";
import { ImcResult } from "./interfaces/ImcResult";
import { calcularImc } from "./services/imcService";
import { InputField } from "./components/InputField";

function ImcForm() {
  const [altura, setAltura] = useState("");
  const [peso, setPeso] = useState("");
  const [resultado, setResultado] = useState<ImcResult | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setResultado(null);

    const alturaNum = parseFloat(altura);
    const pesoNum = parseFloat(peso);

    if (isNaN(alturaNum) || isNaN(pesoNum) || alturaNum <= 0 || pesoNum <= 0) {
      setError("Por favor, ingresa valores válidos (positivos y numéricos).");
      setLoading(false);
      return;
    }
    setLoading(true);

    try {
      const result = await calcularImc(alturaNum, pesoNum);
      setResultado(result);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="main-bg-color min-vh-100 d-flex flex-column align-items-center justify-content-center pt-custom-responsive">
        <div className="text-center text-white mb-4">
          <h1 className="fw-bold fs-2">
            Calcula tu Índice de Masa Corporal (IMC)
          </h1>
          <p className="opacity-75">
            Tu IMC puede ser una medida inicial útil para identificar tu
            clasificación de peso.
          </p>
        </div>
        <div className="card-container shadow-lg d-flex flex-column flex-lg-row">
          <div className="left-panel p-4 d-flex flex-column justify-content-center pd-5">
            <form onSubmit={handleSubmit}>
              <InputField
                label="TU ALTURA"
                value={altura}
                onChange={setAltura}
                unit="m"
                step="0.01"
                min="0.1"
                max="3"
                sublabel="(entre 0,1 y 3 m)"
              />
              <InputField
                label="TU PESO"
                value={peso}
                onChange={setPeso}
                unit="kg"
                min="1"
                max="500"
                sublabel="(entre 1 y 500 kg)"
              />
              {error && <ImcError error={error} />}

              <button
                className="btn btn-primary w-100"
                type="submit"
                disabled={loading}
              >
                {loading ? "Calculando..." : "Calcular"}
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
