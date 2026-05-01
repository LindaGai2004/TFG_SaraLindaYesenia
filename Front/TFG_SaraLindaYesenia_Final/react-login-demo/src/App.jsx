import { Routes, Route, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import VerificacionCuenta from './pages/Auth/VerificacionCuenta';
import RecuperarContrasena from './pages/RecuperarContra/RecuperarContrasena';
import VerificarCodigo from './pages/RecuperarContra/VerificarCodigo';
import RestablecerContrasena from './pages/RecuperarContra/RestablecerContrasena';
import ProtectedRoute from './components/ProtectedRoute';
import Administrador from './pages/Administrador';
import Jefe from './pages/Jefe';
import Trabajador from './pages/Trabajador';
import MiCarrito from './components/Carrito/MiCarrito';
import ResumenPedido from './pages/Carrito/ResumenPedido';
import Productos from './pages/Productos';
import ProductoDetalle from './components/Productos/ProductoDetalle';
import Portfolio from './pages/Cliente';
import PaypalSuccess from './pages/Carrito/PaypalSuccess';
import PaypalCancel from './pages/Carrito/PaypalCancel';
import Checkout from "./pages/Carrito/Checkout";
import Comunidad from './pages/Comunidad';
import NavBar from './components/NavBar';
import Footer from "./components/Footer";
import Chatbot from "./components/Chatbot";
import { useAuth } from "./context/AuthContext";
import './App.css';

export default function App() {
  const location = useLocation();

  const hideNavbarPaths = [
    '/administrador',
    '/jefe',
    '/trabajador',
    '/cliente',
    '/success'
  ];

  const shouldShowNavbar = !hideNavbarPaths.includes(location.pathname);
  const { user } = useAuth();
const rolesExcluidos = ['ROLE_ADMON', 'ROLE_TRABAJADOR', 'ROLE_JEFE'];
const mostrarChatbot = !user || !rolesExcluidos.includes(user?.perfil?.nombre);
  return (
    <>
      {shouldShowNavbar && <NavBar />}

      <main className={shouldShowNavbar ? 'app-content with-navbar' : 'app-content'}>
        <Routes>

          {/* Rutas públicas */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Verificación de cuenta */}
          <Route path="/verificacion-cuenta" element={<VerificacionCuenta />} />

          {/* Rutas para recuperar contraseña */}
          <Route path="/recuperar" element={<RecuperarContrasena />} />
          <Route path="/verificar-codigo" element={<VerificarCodigo />} />
          <Route path="/restablecer" element={<RestablecerContrasena />} />

          {/* Página de productos */}
          <Route path="/productos" element={<Productos />} />
          <Route path="/producto/:id" element={<ProductoDetalle />} />

          {/* Comunidad */}
          <Route path="/comunidad" element={<Comunidad />} />

          {/* Rutas protegidas */}
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
                <Portfolio />
              </ProtectedRoute>
            }
          />

          <Route
            path="/carrito"
            element={
              <ProtectedRoute allowedRoles={['ROLE_CLIENTE']}>
                <MiCarrito />
              </ProtectedRoute>
            }
          />

          <Route
            path="/paypal/success"
            element={
              <ProtectedRoute allowedRoles={['ROLE_CLIENTE']}>
                <PaypalSuccess />
              </ProtectedRoute>
            }
          />

          <Route
            path="/paypal/cancel"
            element={
              <ProtectedRoute allowedRoles={['ROLE_CLIENTE']}>
                <PaypalCancel />
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
          
          <Route
            path="/checkout/:idPedido"
            element={
              <ProtectedRoute allowedRoles={['ROLE_CLIENTE']}>
                <Checkout />
              </ProtectedRoute>
            }
          />

          <Route
            path="/resumen"
            element={
              <ProtectedRoute allowedRoles={['ROLE_CLIENTE']}>
                <ResumenPedido />
              </ProtectedRoute>
            }
          />

          {/* 404 */}
          <Route path="*" element={<NotFound />} />

        </Routes>
      </main>

      <Footer />
       <Chatbot />
    </>
  );
}