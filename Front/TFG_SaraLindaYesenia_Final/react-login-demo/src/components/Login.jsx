import './Login.css';
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate, useLocation } from 'react-router-dom';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from;
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Navbar visible/oculto al hacer scroll (igual que en Home)
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const scrollTimeout = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY < 100) {
        setIsVisible(true);
        if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
        setLastScrollY(currentScrollY);
        return;
      }

      if (currentScrollY > lastScrollY) {
        setIsVisible(false);
        if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
        scrollTimeout.current = setTimeout(() => setIsVisible(true), 1000);
      } else if (currentScrollY < lastScrollY) {
        setIsVisible(true);
        if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
    };
  }, [lastScrollY]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const user = await login(email, password);
    if (!user) {
      setError('Credenciales inválidas');
      return;
    }
    //from existe solo cuando el usuario fue redirigido desde login
    if (from){
      navigate(from, {replace:true});
      return;
    }

    const rolRaw = user?.perfil?.nombre || '';
    const rol = String(rolRaw).trim().toUpperCase();

    switch (rol) {
      case 'ROLE_ADMIN':
      case 'ROLE_ADMON':
        navigate('/administrador');
        break;
      case 'ROLE_JEFE':
        navigate('/jefe');
        break;
      case 'ROLE_TRABAJADOR':
        navigate('/trabajador');
        break;
      case 'ROLE_CLIENTE':
        navigate('/cliente');
        break;
      default:
        navigate('/');
    }
  };

  return (
    <div className="pagina-login">

      {/* FORMULARIO */}
      <div className="login-contenedor">
        <form onSubmit={onSubmit}>
          <h2 className="titulo-login">Iniciar sesión</h2>

          <label className="login-label"></label>
          <input
            className="login-input"
            type="email"
            placeholder='Correo electrónico *'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <label className="login-label"></label>
          <input
            className="login-input"
            type="password"
            placeholder='Contraseña *'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <p className="login-registrar">
            ¿No tienes cuenta? <span>  </span><Link to="/register">Regístrate aquí</Link>
          </p>

          

          {error && <p className="error">{error}</p>}

          <button type="submit" className="login-boton">
            <span>Entrar</span>
          </button>
        </form>
      </div>

      {/* FOOTER */}
      <footer className="footer">
        <div className="contenedor-footer">
          <div className="columna-footer">
            <h3 className="titulo-footer">Compañía</h3>
            <Link to="/contacto" className="enlace-footer">Contáctanos</Link>
            <Link to="/tarjeta-regalo" className="enlace-footer">Tarjeta regalo</Link>
            <Link to="/blog" className="enlace-footer">Blog</Link>
            <Link to="/sostenibilidad" className="enlace-footer">Sostenibilidad</Link>
          </div>

          <div className="columna-footer">
            <h3 className="titulo-footer">Ayuda</h3>
            <Link to="/faq" className="enlace-footer">Preguntas frecuentes</Link>
            <Link to="/envio" className="enlace-footer">Información de envío</Link>
            <Link to="/terminos" className="enlace-footer">Términos de servicio</Link>
            <Link to="/devoluciones" className="enlace-footer">Política de devolución</Link>
          </div>

          <div className="columna-footer">
            <h3 className="titulo-footer">Conectar</h3>
            <div className="logos-footer">
              <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer"><img src="/instagram.jpg" alt="Instagram" /></a>
              <a href="https://www.tiktok.com" target="_blank" rel="noopener noreferrer"><img src="/tiktok.jpg" alt="Tiktok" /></a>
              <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer"><img src="/facebook.jpg" alt="Facebook" /></a>
              <a href="https://www.pinterest.com" target="_blank" rel="noopener noreferrer"><img src="/pinterest.jpg" alt="Pinterest" /></a>
            </div>
          </div>

          <div className="columna-footer">
            <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
              <h1 className="logo-footer">Archives</h1>
            </Link>
            <p>
              Descubre nuestra exquisita colección de libros, cuidadosamente seleccionada para ofrecer diversión y entretenimiento.
            </p>
          </div>
        </div>

        <div className="footer-final">
          <p className="texto-final-footer">
            © 2026 Archives - Todos los derechos reservados. Desarrollado por Sara, Linda y Yesenia.
          </p>
        </div>
      </footer>
    </div>
  );
}