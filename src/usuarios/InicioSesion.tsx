import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import saludable from "../assets/saludable.png";
import { login } from "../services/authService";
import ImcError from "../components/ImcError";
import { InputField } from "../components/InputField";
import "../usuarios/estilos.css";
import { AuthContext } from "../contexts/AuthContext";

function InicioSesion() {
  const authContext = useContext(AuthContext); // Usa useContext explícitamente
  if (!authContext) {
    throw new Error("InicioSesion debe estar dentro de AuthProvider"); // Chequeo para errores
  }
  const { login: authLogin } = authContext; // Desestructura lo que necesitas

  const [email, setEmail] = useState("");
  const [contraseña, setContraseña] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !contraseña) {
      setError("Por favor completá todos los campos.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const nombre = await login(email, contraseña); // Obtén el nombre del servicio
      authLogin(nombre); // Actualiza el contexto con el nombre
      setTimeout(() => {
        navigate("/imc/calcular"); // Delay de 0ms fuerza un nuevo ciclo de render
      }, 0);
    } catch (err: any) {
      setError("El usuario no existe o la contraseña es incorrecta");
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

      <div className="card-container shadow-lg d-flex flex-column flex-lg-row">
        <div className="left-panel p-4 d-flex flex-column justify-content-center">
          <form onSubmit={handleSubmit}>
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
            <button
              className="btn btn-primary w-100"
              type="submit"
              disabled={loading}
            >
              {loading ? "Ingresando..." : "Iniciar Sesión"}
            </button>
          </form>

          <div className="mt-4 text-center text-white">
         
          
            <Link to="/cambiarContraseña" className="text-darkblue fw-bold text-decoration-underline">Olvidé mi contraseña</Link>
         
          </div>
        </div>

        <div className="right-panel p-4">
          <div className="text-center mb-3">
            <div className="user-image mb-3">
              <img src={saludable} alt="Usuario" />
            </div>
            <h3 className="fw-bold fs-5 text-dark">
              Tu Salud, Nuestra Prioridad
            </h3>
          </div>
          <p className="text-muted mb-3 text-center">
            Accedé a tu cuenta personalizada para realizar un seguimiento de tu
            índice de masa corporal y mantener un registro de tu progreso hacia
            una vida más saludable.
          </p>
          <ul className="feature-list">
            <li>
              <div className="dot"></div>
              <span className="small">Cálculos precisos de IMC</span>
            </li>
            <li>
              <div className="dot"></div>
              <span className="small">Historial de resultados</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="mt-4 text-center text-white">
        <p className="small opacity-75">
          ¿No tenés una cuenta?{" "}
          <Link
            to="/registro"
            className="text-white fw-bold text-decoration-underline"
          >
            Registrate haciendo click acá
          </Link>
        </p>
      </div>
    </div>
  );
}

export default InicioSesion;