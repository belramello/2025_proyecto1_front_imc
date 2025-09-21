// src/App.tsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ImcForm from "./ImcForm";
import InicioSesion from "./usuarios/InicioSesion";
import Registro from "./usuarios/Registro";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { PublicRoute } from "./components/PublicRoute";
import Historial from "./components/ImcHistorial";
import NavBar from "./components/NavBar";
import { AuthProvider } from "./contexts/AuthContext";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/imc/calcular" replace />} />

          <Route
            path="/imc/calcular"
            element={
              <ProtectedRoute>
                <NavBar />
                <ImcForm />
              </ProtectedRoute>
            }
          />

          <Route
            path="/inicio-sesion"
            element={
              <PublicRoute>
                <InicioSesion />
              </PublicRoute>
            }
          />

          <Route
            path="/registro"
            element={
              <PublicRoute>
                <Registro />
              </PublicRoute>
            }
          />
          <Route
            path="/historial"
            element={
              <ProtectedRoute>
                <NavBar />
                <Historial />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
