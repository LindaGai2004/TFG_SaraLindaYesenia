import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import api from "../../api/api";
import CodigoInputs from "../../components/CodigoInputs";
import "./VerificarCodigo.css";

export default function VerificarCodigo() {
  const [codigo, setCodigo] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [params] = useSearchParams();
  const navigate = useNavigate();

  const email = params.get("email");

  const [tiempo, setTiempo] = useState(60);
  const [puedeReenviar, setPuedeReenviar] = useState(false);

  useEffect(() => {
    if (tiempo <= 0) {
      setPuedeReenviar(true);
      return;
    }

    const interval = setInterval(() => {
      setTiempo((t) => t - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [tiempo]);


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


  const reenviarCodigo = async () => {
    try {
      await api.apiPost("/auth/reenviar-codigo", { email });
      setTiempo(60);
      setPuedeReenviar(false);
      setMensaje("Nuevo código enviado.");
    } catch (err) {
      setMensaje("Error reenviando el código.");
    }
  };
  

  return (
    <div className="codigo-page">
      <div className="codigo-container">
        <h2>Introduce el código</h2>

        <form onSubmit={handleSubmit}>
          <label>Hemos enviado un código de verificación a <strong>{email}</strong>.  
          Revisa tu correo e introduce el código a continuación.</label>

          <CodigoInputs value={codigo} onChange={setCodigo} />

          {!puedeReenviar ? (
            <p className="contador">Puedes reenviar el código en {tiempo}s</p>
          ) : (
            <button type="button" className="btn-reenviar" onClick={reenviarCodigo}>
              Reenviar código
            </button>
          )}

          <button type="submit">Validar código</button>
        </form>

        {mensaje && <p>{mensaje}</p>}
      </div>
    </div>
  );
}