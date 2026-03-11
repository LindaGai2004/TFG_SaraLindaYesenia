import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../../api/api";
import "./RestablecerContrasena.css";

export default function RestablecerContrasena() {
  const [password, setPassword] = useState("");
  const [confirmar, setConfirmar] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [mostrarPass, setMostrarPass] = useState(false);
  const [mostrarConfirmar, setMostrarConfirmar] = useState(false);

  const [params] = useSearchParams();
  const email = params.get("email");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmar) {
      setMensaje("Las contraseñas no coinciden.");
      return;
    }

    try {
      await api.apiPost("/auth/restablecer", { email, password });
      setMensaje("Contraseña actualizada correctamente.");
      setTimeout(() => {
        window.location.href = "/login";
      }, 1500);
    } catch (err) {
      const msg = err.response?.data || "Error al actualizar la contraseña.";
      setMensaje(msg);
    }
  };

  return (
    <div className="restablecer-page">
      <div className="restablecer-container">
        <h2>Restablecer contraseña</h2>

        <form onSubmit={handleSubmit}>

          {/* Contraseña */}
          <label>Contraseña</label>
          <div className="input-wrapper">
            <input
              type={mostrarPass ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
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
          <label>Confirmar contraseña</label>
          <div className="input-wrapper">
            <input
              type={mostrarConfirmar ? "text" : "password"}
              value={confirmar}
              onChange={(e) => setConfirmar(e.target.value)}
              required
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

          <button type="submit">Guardar contraseña</button>
        </form>

        {mensaje && <p className="mensaje">{mensaje}</p>}
      </div>
    </div>
  );
}