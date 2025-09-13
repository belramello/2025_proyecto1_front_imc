import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import ImcForm from "./ImcForm";
import InicioSesion from "./usuarios/InicioSesion";
import Registro from "./usuarios/Registro";
import { obtenerToken } from "./utils/storage";

function App() {
  const [isAuth, setIsAuth] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = obtenerToken();

    // Si el token es válido, autenticamos
    if (typeof token === "string" && token.length > 0) {
      setIsAuth(true);
    } else {
      // Si no hay token válido, lo borramos por las dudas
      localStorage.removeItem("token");
      setIsAuth(false);
    }

    setIsLoading(false);
  }, []);

  if (isLoading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <p>Cargando...</p>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to={isAuth ? "/imc/calcular" : "/inicio-sesion"} replace />} />

        <Route
          path="/imc/calcular"
          element={isAuth ? <ImcForm /> : <Navigate to="/inicio-sesion" replace />}
        />

        <Route
          path="/inicio-sesion"
          element={
            isAuth ? (
              <Navigate to="/imc/calcular" replace />
            ) : (
              <InicioSesion
                onLoginSuccess={() => {
                  setIsAuth(true);
                }}
              />
            )
          }
        />

        <Route
          path="/registro"
          element={
            isAuth ? (
              <Navigate to="/imc/calcular" replace />
            ) : (
              <Registro
                onCancelar={() => window.location.href = "/inicio-sesion"}
                onRegistrar={() => {
                  setIsAuth(true);
                }}
              />
            )
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;