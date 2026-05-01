import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { apiPost } from '../../api/api';
import { Headphones, User, Search, ShoppingCart } from 'lucide-react';
import './Register.css';

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [address, setAddress] = useState("");
  const [birthdate, setBirthdate] = useState("");
  const [ok, setOk] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  // --- Navbar visible/oculto al hacer scroll (igual que Login/Home) ---
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

  const validate = () => {
    const newErrors = {};

    if (!email.trim()) {
      newErrors.email = "El correo es obligatorio";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Introduce un correo válido";
    }

    if (!password.trim()) {
      newErrors.password = "La contraseña es obligatoria";
    } else if (password.length < 6) {
      newErrors.password = "La contraseña debe tener al menos 6 caracteres";
    }

    if (!name.trim()) {
      newErrors.name = "El nombre es obligatorio";
    } else if (!/^[a-zA-Z\sáéíóúÁÉÍÓÚñÑ]+$/.test(name)) {
      newErrors.name = "El nombre solo puede contener letras y espacios";
    }

    if (!surname.trim()) {
      newErrors.surname = "Los apellidos son obligatorios";
    } else if (!/^[a-zA-Z\sáéíóúÁÉÍÓÚñÑ]+$/.test(surname)) {
      newErrors.surname = "Los apellidos solo pueden contener letras y espacios";
    }

    if (!birthdate.trim()) {
      newErrors.birthdate = "La fecha de nacimiento es obligatoria";
    } else if (new Date(birthdate) > new Date()) {
      newErrors.birthdate = "La fecha de nacimiento no puede ser mayor que la fecha actual";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      await apiPost('/registro', {
        username,
        email,
        password,
        nombre: name,
        apellidos: surname,
        direccion: address,
        fechaNacimiento: birthdate,
        enabled: 0,
        perfil: { idPerfil: 2 }
      });

      navigate(`/verificacion-cuenta?email=${email}`);

    } catch (err) {
      const mensaje = err.message || "Error al crear el usuario";
      alert(mensaje);
    }
  };

  return (
    <div className="pagina-registro">

      {/* --- FORMULARIO --- */}
      <div className="registro-contenedor">
        <form onSubmit={onSubmit}>
          <h2 className="titulo-registro">Registro</h2>

          <div className="registro-bloque">
            <label className="registro-label"></label>
            <input
              className="registro-input"
              placeholder='Usuario *'
              type="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            {errors.email && <p className="error">{errors.email}</p>}
          </div>
          <div className="registro-bloque">
            <label className="registro-label"></label>
            <input
              className="registro-input"
              placeholder='Correo electrónico *'
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            {errors.email && <p className="error">{errors.email}</p>}
          </div>

          <div className="registro-bloque">
            <label className="registro-label"></label>
            <input
              className="registro-input"
              placeholder='Contraseña *'
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {errors.password && <p className="error">{errors.password}</p>}
          </div>

          <div className="registro-bloque">
            <label className="registro-label"></label>
            <input
              className="registro-input"
              placeholder='Nombre *'
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            {errors.name && <p className="error">{errors.name}</p>}
          </div>

          <div className="registro-bloque">
            <label className="registro-label"></label>
            <input
              className="registro-input"
              placeholder='Apellidos *'
              value={surname}
              onChange={(e) => setSurname(e.target.value)}
              required
            />
            {errors.surname && <p className="error">{errors.surname}</p>}
          </div>

          <div className="registro-bloque">
            <label className="registro-label"></label>
            <input
              placeholder='Dirección *'
              className="registro-input"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            />
          </div>

          <div className="registro-bloque">
            <label className="registro-label"></label>
            <input
              placeholder='Fecha de nacimiento *'
              className="registro-input"
              type="date"
              value={birthdate}
              onChange={(e) => setBirthdate(e.target.value)}
              required
            />
            {errors.birthdate && <p className="error">{errors.birthdate}</p>}
          </div>

          <p className="enlace-login">
            ¿Ya tienes cuenta? <Link to="/login">Inicia sesión aquí</Link>
          </p>

          <button type='submit' className="registro-boton"><span>Crear cuenta</span></button>

          {ok && <p className="success">Usuario creado. ¡Ya puedes iniciar sesión!</p>}
        </form>
      </div>
    </div>
  );
}