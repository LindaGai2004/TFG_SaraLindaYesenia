import { BrowserRouter, Routes, Route, useLocation} from 'react-router-dom';
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import Login from './components/Login';
import Register from './components/Register';
import ProtectedRoute from './components/ProtectedRoute';
import Administrador from './pages/Administrador';
import Jefe from './pages/Jefe';
import Trabajador from './pages/Trabajador';
import Cliente from './pages/Cliente';
import MiCarrito from './components/MiCarrito';
import NavBar from './components/NavBar';
import ResumenPedido from './pages/ResumenPedido';  
import './App.css';
export default function App() {
  const location = useLocation();
  const hideNavbarRoutes = ['/cliente'];
  const shouldShowNavbar = !hideNavbarRoutes.includes(location.pathname);

  return (
    <>
      {shouldShowNavbar && <NavBar />}
        <main className={shouldShowNavbar ? 'app-content with-navbar' : 'app-content'}>
      <Routes>
        {/* Dashboard puede ser una landing común o también redirigir según rol */}
        <Route path="/" element={<Home/>} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<NotFound />} />
        {/* Rutas específicas por rol */}
        <Route
          path="/administrador"
          element={
            <ProtectedRoute allowedRoles={['ROLE_ADMON']}>
              <Administrador />
            </ProtectedRoute>
          }
        />
        <Route
          path="/jefe"
          element={
            <ProtectedRoute allowedRoles={['ROLE_JEFE']}>
              <Jefe />
            </ProtectedRoute>
          }
        />
        <Route
          path="/trabajador"
          element={
            <ProtectedRoute allowedRoles={['ROLE_TRABAJADOR']}>
              <Trabajador />
            </ProtectedRoute>
          }
        />
        <Route
          path="/cliente"
          element={
            <ProtectedRoute allowedRoles={['ROLE_CLIENTE']}>
              <Cliente />
            </ProtectedRoute>
          }
        />
        <Route
          path="/carrito"
          element={
            <ProtectedRoute allowedRoles={['ROLE_CLIENTE']}>
              <MiCarrito/>
            </ProtectedRoute>
          }
        />
        <Route
        path="/success"
          element={
          <ProtectedRoute allowedRoles={['ROLE_CLIENTE']}>
              <ResumenPedido />
            </ProtectedRoute>
          }
        />
      </Routes>
      </main>
    </>
  );
}
