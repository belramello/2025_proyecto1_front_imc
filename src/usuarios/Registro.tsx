import React, { useState } from "react";
import saludable from "../assets/saludable.png";
import { register } from "../services/auth";
import { useNavigate } from "react-router-dom";
interface RegistroProps {
  onCancelar: () => void;
  onRegistrar: (nombre: string, email: string, contraseña: string) => void;
}

function Registro({ onCancelar}: RegistroProps) {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [contraseña, setContraseña] = useState("");
  const [mostrarContraseña, setMostrarContraseña] = useState(false);
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
        setError(err.message || "Error al registrar usuario. Intenta nuevamente.");
        console.error("Error en el registro:", err);
        } finally {
        setLoading(false);
        }
  };

  return (
    <div className="main-bg-color min-vh-100 d-flex flex-column align-items-center justify-content-center py-4">
      <div className="text-center text-white mb-3">
        <h1 className="fw-bold fs-3">REGISTRO DE USUARIO</h1>
        <p className="opacity-75 fs-6">
          Crea tu cuenta para comenzar a calcular tu IMC.
        </p>
      </div>

      <div className="card-container custom-card-shadow rounded-4 d-flex flex-column align-items-center p-4">
        <div
          className="rounded-circle overflow-hidden mb-3"
          style={{ width: "90px", height: "90px", backgroundColor: "#0d6efd" }}
        >
          <img
            src={saludable}
            alt="IMC"
            className="img-fluid"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </div>

        <form onSubmit={handleSubmit} className="w-100" style={{ maxWidth: "400px" }}>
          <div className="form-group mb-3">
            <label className="form-label text-dark-blue">Nombre</label>
            <input
              type="text"
              className="form-control custom-input-style"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Ejemplo: Juan"
            />
          </div>

          <div className="form-group mb-3">
            <label className="form-label text-dark-blue">Correo Electrónico</label>
            <input
              type="email"
              className="form-control custom-input-style"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ejemplo@email.com"
            />
          </div>

          <div className="form-group mb-4 position-relative">
            <label className="form-label text-dark-blue">Contraseña</label>
            <input
              type={mostrarContraseña ? "text" : "password"}
              className="form-control pe-5 custom-input-style"
              value={contraseña}
              onChange={(e) => setContraseña(e.target.value)}
              placeholder="••••••••"
            />
            <span
              onClick={() => setMostrarContraseña(!mostrarContraseña)}
              className="position-absolute end-0 translate-middle-y pe-3"
              style={{
                top: "60%",
                cursor: "pointer",
                color: "#6c757d",
              }}
            >
              <i className={`bi ${mostrarContraseña ? "bi-eye-slash" : "bi-eye"}`}></i>
            </span>
          </div>

          {error && <div className="alert alert-danger text-sm py-2">{error}</div>}

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
