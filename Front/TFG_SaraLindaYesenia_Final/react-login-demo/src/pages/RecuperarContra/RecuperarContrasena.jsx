import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/api";
import "./RecuperarContrasena.css";

export default function RecuperarContrasena() {
  const [email, setEmail] = useState("");
  const [mensaje, setMensaje] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje("");

    try {
      const res = await api.post("/auth/recuperar", { email });

      setMensaje("Se ha enviado un código a tu correo.");
      navigate(`/verificar-codigo?email=${email}`);

    } catch (err) {
      const msg = err.response?.data || "No se ha podido enviar el código.";
      setMensaje(msg);
    }
  };

  return (
    <div className="recuperar-page">
      <div className="recuperar-contenedor">
        <h2>Recuperar contraseña</h2>

        <form onSubmit={handleSubmit}>
          <label>
            Introduce el correo electrónico asociado a tu cuenta y te enviaremos un código para restablecer tu contraseña.
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