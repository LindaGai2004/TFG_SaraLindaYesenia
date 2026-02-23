import { createContext, useContext, useEffect, useState } from 'react';
import { apiPost } from '../api/api'; // tu helper (ver abajo)

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

// Mapa simple id_perfil -> ROLE
const PROFILE_MAP = {
  1: 'ROLE_ADMON',
  2: 'ROLE_CLIENTE',
  3: 'ROLE_TRABAJADOR',
  4: 'ROLE_JEFE',
};

// Normaliza lo mínimo que necesitamos (id y rol)
function normalizeUser(u) {
  if (!u) return null;
  const idPerfil = u.perfil?.idPerfil ?? u.id_perfil ?? null;
  const nombreRol = u.perfil?.nombre ?? PROFILE_MAP[idPerfil] ?? '';
  return {
    ...u,
    perfil: { idPerfil, nombre: nombreRol }
  };
}

export function AuthProvider({ children }) {
  // mira si hay un usuario guardado en local storage
  // y si lo hay, lo usa como sesión activa
  const [user, setUser] = useState(() => {

  //Guarda el usuario completo
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [initializing, setInitializing] = useState(true); // marca que estamos cargando la sesión

  // Al arrancar, cargar lo guardado en localStorage (si hay)
  useEffect(() => {
    try {
      const raw = localStorage.getItem('user');
      if (raw) {
        try {
          setUser(JSON.parse(raw));
        } catch (parseErr) {
          // si hay un error al parsear, limpiamos localStorage
          console.error('Error parsing stored user:', parseErr);
          localStorage.removeItem('user');
          setUser(null);
        }
      } else {
        setUser(null);
      }
    } catch (err) {
      // protección extra por si localStorage falla por permisos
      console.error('Error reading localStorage:', err);
      setUser(null);
    } finally {
      // indicamos que hemos intentado inicializar la sesión
      setInitializing(false);
    }
  }, []);


  //Ahora Actualizado para ingresar con email NO username
async function login(email, password) {
  try {
    const res = await apiPost('/api/login', { email, password });

    const normalizedUser = normalizeUser(res.user);

    const authData = {
      ...normalizedUser,
      token: res.token  
    };

    setUser(authData);
    localStorage.setItem('user', JSON.stringify(authData));

    return authData;

  } catch (err) {
    console.error('Login error:', err);
    return null;
  }
}

// Borra el usuario, token y carrito y se hacer logout
function logout() {
  setUser(null);
  localStorage.removeItem('user');
  localStorage.removeItem('token'); 
  localStorage.removeItem('cartItems');
}
  // Exponemos initializing para que ProtectedRoute espere mientras cargamos
  // Mientras se carga la sesión guardada, no bloquea ni permite rutas
  const value = { user, login, logout, initializing };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}