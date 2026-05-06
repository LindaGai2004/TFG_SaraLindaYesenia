import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children, allowedRoles }) {
  const { user, initializing } = useAuth();
  if (initializing) {
    return <div>Cargando...</div>; // o null
  }
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.perfil?.nombre)) {
    return <Navigate to="/" replace />;
  }
  return children;
}