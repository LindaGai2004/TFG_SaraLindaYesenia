import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Search, User, ShoppingCart, Headphones } from 'lucide-react';
import './NavBar.css';

function NavBar({ isVisible = true }) {
  const navigate = useNavigate();
  const { user } = useAuth();

  function entrarCarrito() {
    if (!user) {
      alert('Debes loguearte para ver tu carrito');
      navigate('/login', { state: { from: '/carrito' } });
    } else {
      navigate('/carrito');
    }
  }

  return (
    <nav className={`barra-navegacion ${isVisible ? 'visible' : ''}`}>
      {/* IZQUIERDA */}
      <div className="enlaces-navegacion">
        <Link to="/productos" className="enlace">
          Tienda
          <span>
            <svg aria-hidden="true" focusable="false" className="icon icon-caret" viewBox="0 0 10 6">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M9.354.646a.5.5 0 00-.708 0L5 4.293 1.354.646a.5.5 0 00-.708.708l4 4a.5.5 0 00.708 0l4-4a.5.5 0 000-.708z"
                fill="currentColor"
              />
            </svg>
          </span>
        </Link>

        <Link to="/blogs" className="enlace">
          Blogs
          <span>
            <svg aria-hidden="true" focusable="false" className="icon icon-caret" viewBox="0 0 10 6">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M9.354.646a.5.5 0 00-.708 0L5 4.293 1.354.646a.5.5 0 00-.708.708l4 4a.5.5 0 00.708 0l4-4a.5.5 0 000-.708z"
                fill="currentColor"
              />
            </svg>
          </span>
        </Link>

        <Link to="/comunidad" className="enlace">Comunidad</Link>
        <Link to="/acercaDe" className="enlace">Acerca de</Link>
      </div>

      {/* CENTRO */}
      <div className="titulo-pagina">
        <Link to="/" className="logo-navbar-link">
          <h1 className="logo-navbar">Archives</h1>
        </Link>
      </div>

      {/* DERECHA */}
      <div className="acciones-usuario">
        <div className="accion telefono">
          <Headphones size={22} className="icono-cascos" />
          <span className="texto-telefono">+34 900 123 456</span>
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

        <div className="accion">
          <Search size={22} className="icono-buscar" />
        </div>

        <div className="accion" onClick={entrarCarrito}>
          <ShoppingCart size={22} className="icono-carrito" />
        </div>
      </div>
    </nav>
  );
}

export default NavBar;