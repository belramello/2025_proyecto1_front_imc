import { Link } from "react-router-dom";
import { cerrarSesion } from "../services/authService";

function Navbar() {
  const nombre = localStorage.getItem("nombreUsuario");

  const handleLogout = () => {
    cerrarSesion();
  };

  return (
    <nav
      className="navbar navbar-expand-lg navbar-dark px-4 shadow-sm fixed-top"
      style={{ backgroundColor: "#009fb0" }}
    >
      <div className="container-fluid">
        <Link className="navbar-brand fw-bold" to="/imc/calcular">
          IMC
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarContent"
          aria-controls="navbarContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link" to="/imc/calcular">
                Inicio
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/historial">
                Historial
              </Link>
            </li>
          </ul>

          <div className="d-flex align-items-center">
            <span className="text-white me-3">
              Hola, <strong>{nombre || "Usuario"}</strong>
            </span>
            <button
              className="btn btn-outline-light btn-sm"
              onClick={handleLogout}
            >
              Cerrar sesión
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
