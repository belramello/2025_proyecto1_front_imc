import { useState, useEffect } from "react";
import { obtenerToken } from "../utils/storage";

export const useAuth = () => {
  const [isAuth, setIsAuth] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const token = obtenerToken();
      if (typeof token === "string" && token.length > 0) {
        setIsAuth(true);
      } else {
        localStorage.removeItem("accessToken");
        setIsAuth(false);
      }
      setIsLoading(false);
    };

    checkAuth();

    // Listener para cambios en storage (e.g., login en otra pestaña)
    const handleStorageChange = () => checkAuth();
    window.addEventListener("storage", handleStorageChange);

    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const iniciarSesion = () => setIsAuth(true);
  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken"); // Si usas refresh
    setIsAuth(false);
  };

  return { isAuth, isLoading, iniciarSesion, logout };
};
