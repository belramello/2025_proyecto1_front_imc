import React, { useState } from "react";
import saludable from "../assets/saludable.png";
import { register } from "../services/authService";
import { useNavigate } from "react-router-dom";
import ImcError from "../components/ImcError";
import { InputField } from "../components/InputField";
interface RegistroProps {
  onCancelar: () => void;
  onRegistrar: (nombre: string, email: string, contraseña: string) => void;
}

function Registro({ onCancelar }: RegistroProps) {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [contraseña, setContraseña] = useState("");
  const [error, setError] = useState("");
  const [, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!nombre || !email || !contraseña) {
      setError("Por favor completa todos los campos.");
      setLoading(false);
      return;
    }

    try {
      await register(nombre, email, contraseña);

      navigate("/inicio-sesion");
    } catch (err: any) {
      setError(
        err.message || "Error al registrar usuario. Intenta nuevamente."
      );
      console.error("Error en el registro:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="main-bg-color min-vh-100 d-flex flex-column align-items-center justify-content-center py-4">
      <div className="card-container-register custom-card-shadow rounded-4 d-flex flex-column align-items-center p-4">
        <div className="text-center text-dark-blue mb-3">
          <h1 className="fw-bold fs-3">REGISTRO DE USUARIO</h1>
          <p className="opacity-75 fs-6">
            Crea tu cuenta para comenzar a calcular tu IMC.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="w-100"
          style={{ maxWidth: "400px" }}
        >
          <InputField
            label="NOMBRE"
            value={nombre}
            onChange={setNombre}
            placeholder="Ejemplo: Juan"
            type="text"
          />
          <InputField
            label="CORREO ELECTRÓNICO"
            value={email}
            onChange={setEmail}
            type="email"
            placeholder="ejemplo@email.com"
          />
          <InputField
            label="CONTRASEÑA"
            value={contraseña}
            onChange={setContraseña}
            type="password"
            placeholder="••••••••"
          />
          {error && <ImcError error={error} />}
          <div className="d-flex justify-content-between mt-4">
            <button
              type="button"
              className="btn btn-outline-secondary flex-grow-1 me-2 custom-button-style"
              onClick={onCancelar}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn btn-primary flex-grow-1 ms-2 custom-button-style"
            >
              Guardar Cambios
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Registro;
