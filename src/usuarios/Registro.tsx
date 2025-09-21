import React, { useContext, useState } from "react";
import { register } from "../services/authService";
import ImcError from "../components/ImcError";
import { InputField } from "../components/InputField";
import { useNavigate } from "react-router-dom";
import "../usuarios/estilos.css";
import { AuthContext } from "../contexts/AuthContext";

function Registro() {
  const authContext = useContext(AuthContext); // Usa useContext explícitamente
  if (!authContext) {
    throw new Error("InicioSesion debe estar dentro de AuthProvider"); // Chequeo para errores
  }
  const { login: authLogin } = authContext; // Desestructura lo que necesitas
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [contraseña, setContraseña] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!nombre || !email || !contraseña) {
      setError("Por favor completa todos los campos.");
      return;
    }
    setLoading(true);
    try {
      await register(nombre, email, contraseña);
      authLogin(nombre);
      navigate("/imc/calcular");
    } catch (err: any) {
      setError(
        err.message || "Error al registrar usuario. Intenta nuevamente."
      );
      console.error("Error en el registro:", err);
    } finally {
      setLoading(false);
    }
  };

  const onCancelar = () => {
    navigate("/inicio-sesion");
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

        <form onSubmit={handleSubmit} className="form-register">
          <InputField
            label="Nombre"
            value={nombre}
            onChange={setNombre}
            placeholder="Ejemplo: Juan"
            type="text"
          />
          <InputField
            label="Correo Electrónico"
            value={email}
            onChange={setEmail}
            type="email"
            placeholder="ejemplo@email.com"
          />
          <InputField
            label="Contraseña"
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
              {loading ? "Registrando..." : "Registrarse"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Registro;
