import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { resetPassword } from "../services/usersService";
import ImcError from "../components/ImcError";
import { InputField } from "../components/InputField";
import "../usuarios/estilos.css";

function NuevaContraseña() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmarContraseña, setConfirmarContraseña] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const token = new URLSearchParams(location.search).get("token");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!token) {
      setError("Token inválido. Volvé a solicitar el cambio de contraseña.");
      return;
    }

    if (!newPassword || !confirmarContraseña) {
      setError("Por favor completá todos los campos.");
      return;
    }

    if (newPassword !== confirmarContraseña) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    setLoading(true);
    try {
      await resetPassword(token, newPassword);
      navigate("/inicio-sesion");
    } catch (err: any) {
      setError(err.message);
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
          <h1 className="fw-bold fs-3">RECUPERAR CONTRASEÑA</h1>
          <p className="opacity-75 fs-6">Ingresá los siguientes datos: </p>
        </div>

        <form onSubmit={handleSubmit} className="form-register">
          <InputField
            label="Nueva Contraseña"
            value={newPassword}
            onChange={setNewPassword}
            type="password"
            placeholder="••••••••"
          />
          <InputField
            label="Confirmar Contraseña"
            value={confirmarContraseña}
            onChange={setConfirmarContraseña}
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
              disabled={loading}
            >
              {loading ? "Actualizando..." : "Guardar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default NuevaContraseña;
