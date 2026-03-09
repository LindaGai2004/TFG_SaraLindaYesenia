import './Login.css';
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import NotificacionToken from "../../components/Notificacion_token.jsx";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from;
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [mensaje, setMensaje] = useState("");

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

  useEffect(() => {
    const expirado = localStorage.getItem("token_expirado");
    if (expirado) {
      setMensaje("Tu sesión ha expirado. Inicia sesión de nuevo.");
      localStorage.removeItem("token_expirado");
    }
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const user = await login(email, password);

    if (!user) {
      setError("Credenciales inválidas");
      return;
    }

    if (user.error) {
      setError(user.error);
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

      <NotificacionToken mensaje={mensaje} onClose={() => setMensaje("")} />

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

          <p className="login-olvido">
            <Link to="/recuperar">¿Has olvidado tu contraseña?</Link>
          </p>

          {error && <p className="error">{error}</p>}

          <button type="submit" className="login-boton">
            <span>Entrar</span>
          </button>

          <p className="login-registrar">
            ¿No tienes cuenta? <span>  </span><Link to="/register">Regístrate aquí</Link>
          </p>
        </form>
      </div>
    </div>
  );
}