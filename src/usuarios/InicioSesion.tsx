import React, { useState } from "react";
import { Link } from "react-router-dom";
import saludable from "../assets/saludable.png";
import { login } from "../services/auth";
import { guardarToken } from "../utils/storage";

type Props = {
  onLoginSuccess: () => void;
};

function InicioSesion({ onLoginSuccess }: Props) {
  const [email, setEmail] = useState("");
  const [contraseña, setContraseña] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !contraseña) {
      setError("Por favor completá todos los campos.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const { accessToken, refreshToken } = await login(email, contraseña);
      guardarToken(accessToken, refreshToken);
      onLoginSuccess(); // 🔥 Esto actualiza el estado y navega desde AppRoutes
    } catch (err: any) {
      setError(err.message || "Error al iniciar sesión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="main-bg-color min-vh-100 d-flex flex-column align-items-center justify-content-center">
      <div className="text-center text-white mb-4">
        <h1 className="fw-bold fs-2">CALCULADORA DE IMC</h1>
        <p className="opacity-75">
          Accedé a tu cuenta para calcular tu IMC y guardar tus resultados.
        </p>
      </div>

      <div className="card-container shadow-lg d-flex">
        <div className="left-panel p-4 d-flex flex-column justify-content-center" style={{ minWidth: "300px" }}>
          <form onSubmit={handleSubmit}>
            <div className="form-group mb-4">
              <label className="form-label text-dark-blue">Correo Electrónico</label>
              <input
                type="email"
                className="form-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ejemplo@email.com"
              />
            </div>

            <div className="form-group mb-5">
              <label className="form-label text-dark-blue">Contraseña</label>
              <input
                type="password"
                className="form-control"
                value={contraseña}
                onChange={(e) => setContraseña(e.target.value)}
                placeholder="••••••••"
              />
            </div>

            {error && <div className="alert alert-danger text-sm">{error}</div>}

            <button className="btn btn-primary w-100" type="submit" disabled={loading}>
              {loading ? "Ingresando..." : "Iniciar Sesión"}
            </button>
          </form>
        </div>

        <div className="right-panel p-4 text-center">
          <div className="mb-3">
            <div
              className="rounded-circle overflow-hidden mx-auto mb-3"
              style={{ width: "80px", height: "80px", backgroundColor: "#0d6efd" }}
            >
              <img
                src={saludable}
                alt="Usuario"
                className="img-fluid"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>
            <h3 className="fw-bold fs-5 text-dark">Tu Salud, Nuestra Prioridad</h3>
          </div>

          <p className="text-muted mb-3">
            Accedé a tu cuenta personalizada para realizar un seguimiento de tu índice de masa corporal y mantener un registro de tu progreso hacia una vida más saludable.
          </p>

          <ul className="list-unstyled text-start mx-auto" style={{ maxWidth: "250px" }}>
            <li className="mb-2 d-flex align-items-center text-dark">
              <div className="bg-primary rounded-circle me-2" style={{ width: "8px", height: "8px" }}></div>
              <span className="small">Cálculos precisos de IMC</span>
            </li>
            <li className="mb-2 d-flex align-items-center text-dark">
              <div className="bg-primary rounded-circle me-2" style={{ width: "8px", height: "8px" }}></div>
              <span className="small">Historial de resultados</span>
            </li>
            <li className="mb-2 d-flex align-items-center text-dark">
              <div className="bg-primary rounded-circle me-2" style={{ width: "8px", height: "8px" }}></div>
              <span className="small">Recomendaciones personalizadas</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="mt-4 text-center text-white">
        <p className="small opacity-75">
          ¿No tenés una cuenta?{" "}
          <Link to="/registro" className="text-white fw-bold text-decoration-underline">
            Registrate haciendo click acá
          </Link>
        </p>
      </div>
    </div>
  );
}

export default InicioSesion;
