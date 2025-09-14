import { useState, useEffect } from "react";
import { obtenerToken, eliminarTokens } from "../utils/storage";

interface JwtPayload {
  exp?: number;
}

// Función para validar JWT (sin librerías externas)
const isValidJwt = (token: string | null): boolean => {
  if (!token) return false;
  try {
    const payload = JSON.parse(atob(token.split(".")[1])) as JwtPayload;
    if (!payload.exp) return false;
    // Verifica si el token está expirado (exp es en segundos)
    return payload.exp * 1000 > Date.now();
  } catch (error) {
    console.error("Error al parsear JWT:", error);
    return false;
  }
};

export const useAuth = () => {
  const [isAuth, setIsAuth] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const token = obtenerToken();
      if (token && isValidJwt(token)) {
        setIsAuth(true);
      } else {
        eliminarTokens();
        setIsAuth(false);
      }
      setIsLoading(false);
    };

    checkAuth();

    // Listener para cambios en storage (e.g., logout en otra pestaña)
    const handleStorageChange = () => checkAuth();
    window.addEventListener("storage", handleStorageChange);

    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const login = () => setIsAuth(true);

  return { isAuth, isLoading, login };
};
