import {Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {Search, User, ShoppingCart, Headphones, AlertTriangle} from 'lucide-react';
import './NavBar.css';

function NavBar({isVisible=true}) {
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    function entrarCarrito() {
        if (!user) {
            alert('Debes loguearte para ver tu carrito');
            navigate('/login', 
              {state:{ from: '/carrito'}}
            );
        } else {
            navigate('/carrito')
        }
    }
    return (
<>
      {/* Navegación */}
      <nav className={`barra-navegacion ${isVisible ? 'visible' : ''}`}>
        {/* Enlaces a la izquierda */}
        <div className="enlaces-navegacion">
          <Link to="/productos" className="enlace">Tienda <span><svg aria-hidden="true" focusable="false" class="icon icon-caret" viewBox="0 0 10 6">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M9.354.646a.5.5 0 00-.708 0L5 4.293 1.354.646a.5.5 0 00-.708.708l4 4a.5.5 0 00.708 0l4-4a.5.5 0 000-.708z" fill="currentColor"></path>
          </svg></span></Link>
          <Link to="/blogs" className="enlace">Blogs <span><svg aria-hidden="true" focusable="false" class="icon icon-caret" viewBox="0 0 10 6">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M9.354.646a.5.5 0 00-.708 0L5 4.293 1.354.646a.5.5 0 00-.708.708l4 4a.5.5 0 00.708 0l4-4a.5.5 0 000-.708z" fill="currentColor"></path>
          </svg></span></Link>
          <Link to="/acercaDe" className="enlace">Acerca de</Link>
        </div>

        {/* Título en el centro */}
        <div className="titulo-pagina">
          <Link to="/">
            <h1>Archives</h1>
          </Link>
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
          <Link to="/login" className="accion">
            <User size={24} />
          </Link>

          {/* Lupa */}
          <div className="accion">
            <Search size={22} className="icono-buscar" />
          </div>

          {/* Carrito */}
          <div className="accion" onClick={entrarCarrito}>
            <ShoppingCart size={22} className="icono-carrito" />
          </div>
        </div>
      </nav>
    </>
    );
}

export default NavBar;