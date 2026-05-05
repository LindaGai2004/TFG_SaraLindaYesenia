import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Search, User, ShoppingCart, Headphones } from 'lucide-react';
import { useState } from 'react';
import { useCart } from '../context/CartContext';
import CartSidebar from './Carrito/CartSideBar.jsx';
import './NavBar.css';

function NavBar({ isVisible = true }) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { cartItems } = useCart();
  
  // Estado para controlar el Sidebar
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Calculamos la cantidad total de productos
  const totalItems = cartItems?.reduce((acc, item) => acc + item.cantidad, 0) || 0;

  // Función para manejar el carrito
  function manejarClickCarrito() {
    if (!user) {
      alert('Debes loguearte para ver tu carrito');
      navigate('/login', { state: { from: window.location.pathname } });
    } else {
      // En lugar de navegar, abrimos el sidebar
      setIsSidebarOpen(true);
    }
  }


  return (
    <>
      <nav className={`barra-navegacion ${isVisible ? 'visible' : ''}`}>
        {/* IZQUIERDA: Enlaces de navegación */}
        <div className="enlaces-navegacion">
          <Link to="/productos" className="enlace">
            Tienda
            {/*<span>
              <svg aria-hidden="true" focusable="false" className="icon icon-caret" viewBox="0 0 10 6">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M9.354.646a.5.5 0 00-.708 0L5 4.293 1.354.646a.5.5 0 00-.708.708l4 4a.5.5 0 00.708 0l4-4a.5.5 0 000-.708z"
                  fill="currentColor"
                />
              </svg>
            </span>*/}
          </Link>

          <Link to="/comunidad" className="enlace">Comunidad</Link>
          <Link to="/acercaDe" className="enlace">Acerca de</Link>
        </div>

        {/* CENTRO - Logo */}
        <div className="titulo-pagina">
          <Link to="/" className="logo-navbar-link">
            <h1 className="logo-navbar">Archives</h1>
          </Link>
        </div>

        {/* DERECHA: Acciones de usuario */}
        <div className="acciones-usuario">

          <div
            className="accion"
            onClick={() => {
              if (!user) {
                navigate("/login");
              } else {
                {/*const rol = user.perfil?.nombre;
                if (rol === "ROLE_CLIENTE") navigate("/cliente");
                else if (rol === "ROLE_ADMON") navigate("/administrador");
                else if (rol === "ROLE_JEFE") navigate("/jefe");
                else if (rol === "ROLE_TRABAJADOR") navigate("/trabajador");*/}
                
                if (user.perfil?.nombre === "ROLE_CLIENTE") navigate("/cliente");
                else if (user.perfil?.nombre === "ROLE_ADMON") navigate("/administrador");
                else if (user.perfil?.nombre === "ROLE_JEFE") navigate("/jefe");
                else if (user.perfil?.nombre === "ROLE_TRABAJADOR") navigate("/trabajador");
              }
            }}
          >
            <User size={24} />
          </div>

          <div className="accion">
            <Search size={22} className="icono-buscar" />
          </div>

          {/* Icono de Carrit */}
          <div className="accion contenedor-carrito" onClick={manejarClickCarrito}>
            <ShoppingCart size={22} className="icono-carrito" />
            {totalItems > 0 && (
              <span className="carrito-badge">{totalItems}</span>
            )}
          </div>
        </div>
      </nav>

      {/* El Sidebar se renderiza fuera del <nav> */}
      <CartSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
    </>
  );
}

export default NavBar;