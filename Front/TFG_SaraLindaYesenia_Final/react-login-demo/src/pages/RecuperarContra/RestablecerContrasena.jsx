import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import api from "../../api/api";
import "./RestablecerContrasena.css";

export default function RestablecerContrasena() {
  const [password, setPassword] = useState("");
  const [confirmar, setConfirmar] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [cargando, setCargando] = useState(false);
  const [mostrarPass, setMostrarPass] = useState(false);
  const [mostrarConfirmar, setMostrarConfirmar] = useState(false);

  const [params] = useSearchParams();
  const navigate = useNavigate();
  const email = params.get("email");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje(""); 

    // Validación de longitud
    if (password.length < 6) {
        setMensaje("La contraseña debe tener al menos 6 caracteres.");
        return;
    }

    // Validación de coincidencia
    if (password !== confirmar) {
      setMensaje("Las contraseñas no coinciden. Revisa que ambas sean iguales.");
      return;
    }

    setCargando(true);
    try {
      await api.apiPost("/auth/restablecer", { email, password });
      
      setMensaje("Contraseña actualizada correctamente. Redirigiendo al login...");
      
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      const msg = err.response?.data || "Error al actualizar la contraseña.";
      setMensaje(`${msg}`);
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="restablecer-page">
      <div className="restablecer-container">
        <h2>Restablecer contraseña</h2>
        <p className="instrucciones">Crea una nueva contraseña segura para tu cuenta.</p>

        <form onSubmit={handleSubmit}>

          {/* Contraseña */}
          <label>Nueva contraseña</label>
          <div className="input-wrapper">
            <input
              type={mostrarPass ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mínimo 6 caracteres"
              required
              disabled={cargando}
            />

            <span
              className="toggle-ojito"
              onClick={() => setMostrarPass(!mostrarPass)}
            >
              <img
                src={mostrarPass ? "/ojos_abiertos.png" : "/ojos_cerrados.png"}
                alt="toggle password"
                className="icono-ojito"
              />
            </span>
          </div>

          {/* Confirmar contraseña */}
          <label>Confirmar nueva contraseña</label>
          <div className="input-wrapper">
            <input
              type={mostrarConfirmar ? "text" : "password"}
              value={confirmar}
              onChange={(e) => setConfirmar(e.target.value)}
              placeholder="Repite tu contraseña"
              required
              disabled={cargando}
            />
            <span
              className="toggle-ojito"
              onClick={() => setMostrarConfirmar(!mostrarConfirmar)}
            >
              <img
                src={mostrarConfirmar ? "/ojos_abiertos.png" : "/ojos_cerrados.png"}
                alt="toggle password"
                className="icono-ojito"
              />
            </span>
          </div>

          {/* Aviso dinámico mientras escribe si no coinciden */}
          {confirmar.length > 0 && password !== confirmar && (
            <span className="error-live">Las contraseñas no coinciden</span>
          )}

          <button type="submit" disabled={cargando || password.length < 6}>
            {cargando ? "Guardando..." : "Guardar contraseña"}
          </button>
        </form>

        {mensaje && (
          <div className={`mensaje-box ${mensaje.includes("correctamente") ? "exito" : "error"}`}>
            {mensaje}
          </div>
        )}
      </div>
    </div>
  );
}