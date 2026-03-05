import { useState } from "react";
import api from "../../api/api";
import "./RecuperarContrasena.css";

export default function RecuperarContrasena() {
  const [email, setEmail] = useState("");
  const [mensaje, setMensaje] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post("/auth/recuperar", { email });
      setMensaje("Se ha enviado un código a tu correo.");
      // Redirigir a la pantalla de código
      window.location.href = `/verificar-codigo?email=${email}`;
    } catch (err) {
      setMensaje("No se ha podido enviar el código.");
    }
  };

  return (
    <div className="recuperar-page">
      <div className="recuperar-contenedor">
        <h2>Recuperar contraseña</h2>

        <form onSubmit={handleSubmit}>
          <label>
            Introduce el correo electrónico asociado a tu cuenta y nosotros te enviaremos un 
            correo con un código para restablecer tu contraseña
          </label>

          <input
            className="login-input"
            type="email"
            placeholder="Correo electrónico"

            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <button type="submit" className="login-boton">
            <span>Continuar</span>
          </button>
        </form>

        {mensaje && <p>{mensaje}</p>}
      </div>
    </div>
  );
}