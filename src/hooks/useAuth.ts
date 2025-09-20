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
  const [nombre, setNombre] = useState<string | null>(null); // Nuevo estado para nombre
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const token = obtenerToken();
      const storedNombre = localStorage.getItem("nombreUsuario"); // Carga nombre de localStorage
      if (token && isValidJwt(token) && storedNombre) {
        setIsAuth(true);
        setNombre(storedNombre); // Setea nombre si token es válido
      } else {
        eliminarTokens();
        localStorage.removeItem("nombreUsuario"); // Limpia nombre si no autenticado
        setIsAuth(false);
        setNombre(null);
      }
      setIsLoading(false);
    };

    checkAuth();

    // Listener para cambios en storage (e.g., logout en otra pestaña)
    const handleStorageChange = () => checkAuth();
    window.addEventListener("storage", handleStorageChange);

    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // Función login actualizada: setea isAuth y nombre, y sincroniza localStorage
  const login = (newNombre: string) => {
    setIsAuth(true);
    setNombre(newNombre);
    localStorage.setItem("nombreUsuario", newNombre); // Sincroniza con localStorage
  };

  // Agrega una función logout para consistencia (opcional, pero útil)
  const logout = () => {
    eliminarTokens();
    window.location.href = "/inicio-sesion"; // Redirige al login
    localStorage.removeItem("nombreUsuario");
    setIsAuth(false);
    setNombre(null);
  };

  return { isAuth, isLoading, nombre, login, logout }; // Exporta nombre y logout
};