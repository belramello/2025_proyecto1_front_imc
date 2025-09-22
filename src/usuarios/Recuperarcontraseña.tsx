import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { InputField } from "../components/InputField";
import ImcError from "../components/ImcError";
import "../usuarios/estilos.css";
import { forgotPassword } from "../services/usersService";

function RecuperarContraseña() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(""); // ✅ Nuevo estado para éxito
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!email) {
      setError("Por favor completá el email.");
      return;
    }

    setLoading(true);
    try {
      await forgotPassword({ email });
      setSuccess(
        "El mail fue enviado con éxito. Revisá tu casilla de entrada para continuar con la recuperación de contraseña."
      );
      setEmail("");
    } catch (err: any) {
      setError(err.message || "Error al enviar email de recuperación.");
    } finally {
      setLoading(false);
    }
  };

  const onCancelar = () => {
    navigate("/inicio-sesion");
  };

  return (
    <div className="main-bg-color min-vh-100 d-flex flex-column align-items-center justify-content-center py-4">
      <div
        className="card-container-register custom-card-shadow rounded-4 d-flex flex-column align-items-center p-5"
        style={{
          minWidth: "320px",
          maxWidth: "500px",
          width: "90%",
        }}
      >
        <div className="text-center mb-4">
          <h1 className="fw-bold fs-3 text-dark-blue">RECUPERAR CONTRASEÑA</h1>
          <p className="fw-bold fs-6 text-dark-blue">INGRESÁ TU EMAIL</p>
          <p className="opacity-75 small">
            Si el correo ingresado corresponde a un usuario registrado,
            recibirás un mail con un enlace para recuperar tu contraseña.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="form-register w-100">
          <InputField
            label="Email"
            value={email}
            onChange={setEmail}
            type="email"
            placeholder="ejemplo@email.com"
          />

          {error && <ImcError error={error} />}
          {success && (
            <div className="alert alert-success text-center mt-3 p-2 rounded-3">
              {success}
            </div>
          )}

          <div className="d-flex justify-content-between mt-4 gap-2">
            <button
              type="button"
              className="btn btn-outline-secondary flex-grow-1 custom-button-style"
              onClick={onCancelar}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn btn-primary flex-grow-1 custom-button-style"
              disabled={loading}
            >
              {loading ? "Enviando..." : "Enviar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default RecuperarContraseña;
