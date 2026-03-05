import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../../api/api";

export default function RestablecerContrasena() {
  const [password, setPassword] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [params] = useSearchParams();
  const email = params.get("email");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.post("/auth/restablecer", { email, nuevaPassword: password });
      setMensaje("Contraseña actualizada correctamente.");
      setTimeout(() => {
        window.location.href = "/login";
      }, 1500);
    } catch (err) {
      setMensaje("Error al actualizar la contraseña.");
    }
  };

  return (
    <div className="restablecer-container">
      <h2>Nueva contraseña</h2>

      <form onSubmit={handleSubmit}>
        <label>Introduce tu nueva contraseña</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit">Guardar contraseña</button>
      </form>

      {mensaje && <p>{mensaje}</p>}
    </div>
  );
}