import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Search, User, ShoppingCart, Headphones, AlertTriangle } from 'lucide-react';
import CartSidebar from './Carrito/CartSideBar.jsx';
import { useState } from 'react';
import './NavBar.css';

function NavBar({ isVisible = true }) {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Estado para controlar la apertura del sidebar
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [mostrarAvisoLogin, setMostrarAvisoLogin] = useState(false);

  function manejarClickCarrito() {
    if (!user) {
      setMostrarAvisoLogin(true);
    } else {
      setIsSidebarOpen(true);
    }
  }
  return (
    <>
      {mostrarAvisoLogin && (
        <div className="notificacion-login">
          <p>Debes iniciar sesión para ver tu carrito.</p>
          <div className="notificacion-botones">
            <button
              className="btn-login-aviso"
              onClick={() => {
                setMostrarAvisoLogin(false);
                navigate('/login', { state: { from: '/carrito' } });
              }}
            >
              Ir al login
            </button>
            <button className="btn-cerrar-aviso" onClick={() => setMostrarAvisoLogin(false)}>
              Cerrar
            </button>
          </div>
        </div>
      )}
      {/* Navegación */}
      <nav className={`barra-navegacion ${isVisible ? 'visible' : ''}`}>
        {/* Enlaces a la izquierda */}
        <div className="enlaces-navegacion">
          <Link to="/productos" className="enlace">Tienda <span><svg aria-hidden="true" focusable="false" class="icon icon-caret" viewBox="0 0 10 6">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M9.354.646a.5.5 0 00-.708 0L5 4.293 1.354.646a.5.5 0 00-.708.708l4 4a.5.5 0 00.708 0l4-4a.5.5 0 000-.708z" fill="currentColor"></path>
          </svg></span></Link>
          <Link to="/comunidad" className="enlace">Comunidad</Link>
          <Link to="/acercaDe" className="enlace">Acerca de</Link>
        </div>

        <div className="separador"></div>

        <div
          className="accion"
          onClick={() => {
            if (!user) {
              navigate("/login");
            } else {
              const rol = user.perfil?.nombre;
              if (rol === "ROLE_CLIENTE") navigate("/cliente");
              else if (rol === "ROLE_ADMON") navigate("/administrador");
              else if (rol === "ROLE_JEFE") navigate("/jefe");
              else if (rol === "ROLE_TRABAJADOR") navigate("/trabajador");
            }
          }}
        >
          <User size={24} />
        </div>

        {/* Acciones a la derecha */}
        <div className="acciones-usuario">
          {/* Teléfono con cascos */}
          <div className="accion telefono">
            <Headphones size={22} className="icono-cascos" />
            <span className="texto-telefono">+34 900 123 456</span>
          </div>

          {/* Separador vertical */}
          <div className="separador"></div>

          {/* Login: Aquí si el usuario ya está logueado no debería volver a pedir q se loguee de nuevo (!!) */}
          <div
            className="accion"
            onClick={() => {
              if (!user) {
                navigate("/login");
              } else {
                if (user.perfil?.nombre === "ROLE_CLIENTE") {
                  navigate("/cliente");
                } else if (user.perfil?.nombre === "ROLE_ADMON") {
                  navigate("/administrador");
                } else if (user.perfil?.nombre === "ROLE_JEFE") {
                  navigate("/jefe");
                } else if (user.perfil?.nombre === "ROLE_TRABAJADOR") {
                  navigate("/trabajador");
                }
              }
            }}
          >
            <User size={24} />
          </div>

          {/* Lupa */}
          <div className="accion">
            <Search size={22} className="icono-buscar" />
          </div>

          {/* Carrito */}
          <div className="accion" onClick={manejarClickCarrito}>
            <ShoppingCart size={22} className="icono-carrito" />
          </div>
        </div>
      </nav>
      <CartSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />
    </>
  );
}

export default NavBar;