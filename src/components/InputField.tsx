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
}) => {
  return (
    <div className="form-group mb-4">
      <label className="form-label text-dark-blue">{label}</label>
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
