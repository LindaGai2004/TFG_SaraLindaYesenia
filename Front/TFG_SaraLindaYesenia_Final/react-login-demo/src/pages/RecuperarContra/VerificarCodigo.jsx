import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import api from "../../api/api";
import "./VerificarCodigo.css";

export default function VerificarCodigo() {
  const [codigo, setCodigo] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [params] = useSearchParams();
  const navigate = useNavigate();

  const email = params.get("email");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje("");

    try {
      await api.apiPost("/auth/verificar-codigo", { email, codigo });
      navigate(`/restablecer?email=${email}`);
    } catch (err) {
      const msg = err.response?.data || "Código incorrecto o expirado.";
      setMensaje(msg);
    }
  };

  return (
    <div className="codigo-page">
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
    </div>
  );
}