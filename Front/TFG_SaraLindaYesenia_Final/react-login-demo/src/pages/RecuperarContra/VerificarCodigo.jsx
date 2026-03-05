import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../../api/api";

export default function VerificarCodigo() {
  const [codigo, setCodigo] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [params] = useSearchParams();
  const email = params.get("email");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.post("/auth/verificar-codigo", { email, codigo });
      window.location.href = `/restablecer?email=${email}`;
    } catch (err) {
      setMensaje("Código incorrecto o expirado.");
    }
  };

  return (
    <div className="codigo-container">
      <h2>Introduce el código</h2>

      <form onSubmit={handleSubmit}>
        <label>Código recibido por email</label>
        <input
          type="text"
          value={codigo}
          onChange={(e) => setCodigo(e.target.value)}
          required
        />

        <button type="submit">Validar código</button>
      </form>

      {mensaje && <p>{mensaje}</p>}
    </div>
  );
}