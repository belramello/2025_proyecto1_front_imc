import React from "react";

interface InputFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  unit?: string;
  type?: string;
  step?: string;
  min?: string;
  max?: string;
  placeholder?: string;
  sublabel?: string;
}

export const InputField: React.FC<InputFieldProps> = ({
  label,
  value,
  onChange,
  unit,
  type = "number",
  step,
  min,
  max,
  placeholder,
  sublabel,
}) => {
  return (
    <div className="form-group mb-4">
      <div className="d-flex justify-content-between align-items-center mb-1">
        <label className="form-label text-dark-blue m-0">{label}</label>
        {sublabel && (
          <span className="text-muted small  ms-3 me-4 ">{sublabel}</span>
        )}
      </div>

      <div className="d-flex align-items-center">
        <input
          type={type}
          className="form-control"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          step={step}
          min={min}
          max={max}
          placeholder={placeholder}
        />
        {unit && <span className="unit-label ms-2">{unit}</span>}
      </div>
    </div>
  );
};
