import { ReactNode, useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";

interface ProtectedRouteProps {
  children: ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const authContext = useContext(AuthContext); // Usa useContext
  if (!authContext) {
    throw new Error("Navbar debe estar dentro de AuthProvider");
  }
  const { isLoading, isAuth } = authContext; // Desestructura

  if (isLoading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          backgroundColor: "#009fb0",
        }}
      >
        <p>Cargando...</p>
      </div>
    );
  }

  return isAuth ? <>{children}</> : <Navigate to="/inicio-sesion" replace />;
};
