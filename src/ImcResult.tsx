import React from "react";

interface Props {
  imc: number;
  categoria: string;
}

function getCategoriaColor(categoria: string) {
  switch (categoria.toLowerCase()) {
    case "obeso":
      return "text-danger";
    case "sobrepeso":
      return "text-danger";
    case "normal":
      return "text-success";
    case "bajo peso":
      return "text-warning";
  }
}

const ImcResult: React.FC<Props> = ({ imc, categoria }) => {
  const colorClass = getCategoriaColor(categoria);

  return (
    <div className="result-container">
      <p className="result-title">TU IMC ES</p>
      <h2 className={`result-value ${colorClass}`}>{imc.toFixed(2)}</h2>
      <div className="result-details">
        <p>
          Clasificación de peso:{" "}
          <span className={`fw-bold ${colorClass}`}>{categoria}</span>
        </p>
      </div>
    </div>
  );
};

export default ImcResult;
