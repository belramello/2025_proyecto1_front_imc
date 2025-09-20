import { createContext, useState, useEffect, ReactNode } from 'react';
import { obtenerToken, eliminarTokens } from '../utils/storage';

// Interface JwtPayload (igual)
interface JwtPayload {
  exp?: number;
}

// Función isValidJwt (igual)
const isValidJwt = (token: string | null): boolean => {
  if (!token) return false;
  try {
    const payload = JSON.parse(atob(token.split('.')[1])) as JwtPayload;
    if (!payload.exp) return false;
    return payload.exp * 1000 > Date.now();
  } catch (error) {
    console.error('Error al parsear JWT:', error);
    return false;
  }
};

// Tipo para el valor del contexto
export interface AuthContextType {
  isAuth: boolean;
  nombre: string | null;
  isLoading: boolean;
  login: (newNombre: string) => void;
  logout: () => void;
}

// Contexto con valor default (usa undefined para forzar chequeo)
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider que envuelve la app
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuth, setIsAuth] = useState(false);
  const [nombre, setNombre] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const token = obtenerToken();
      const storedNombre = localStorage.getItem('nombreUsuario');
      console.log('checkAuth: token válido?', token && isValidJwt(token)); // Loggea si auth inicial es válido
      console.log('checkAuth: nombre cargado', storedNombre);
      if (token && isValidJwt(token) && storedNombre) {
        setIsAuth(true);
        setNombre(storedNombre);
      } else {
        eliminarTokens();
        localStorage.removeItem('nombreUsuario');
        setIsAuth(false);
        setNombre(null);
      }
      setIsLoading(false);
    };

    checkAuth();

    const handleStorageChange = () => checkAuth();
    window.addEventListener('storage', handleStorageChange);

    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const login = (newNombre: string) => {
    setIsAuth(true);
    setNombre(newNombre);
    localStorage.setItem('nombreUsuario', newNombre);
  };

  const logout = () => {
  eliminarTokens(); // Limpia tokens
  localStorage.removeItem('nombreUsuario'); // Limpia nombre
  window.location.href = '/inicio-sesion'; // Redirige inmediatamente
};

  return (
    <AuthContext.Provider value={{ isAuth, nombre, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};