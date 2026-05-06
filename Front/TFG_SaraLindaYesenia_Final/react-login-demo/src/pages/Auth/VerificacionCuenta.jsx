import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import api from "../../api/api";
import "./VerificacionCuenta.css";

export default function VerificacionCuenta() {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  const email = params.get("email");
  const token = params.get("token");

  const [mensaje, setMensaje] = useState("");
  const [loading, setLoading] = useState(false);

  const [verificado, setVerificado] = useState(false);

  // Si viene con token -> verificar automáticamente
  useEffect(() => {
    if (verificado) return; // evita reverificar

    if (token) {
      setLoading(true);
      api.apiPost(`/auth/verificar?token=${token}`)
        .then(() => {
          setMensaje("Cuenta verificada correctamente. Ya puedes iniciar sesión.");
          setVerificado(true); // marca como verificado
        })
        .catch(() => {
          setMensaje("El enlace de verificación ya no es válido.");
          setVerificado(true); // evita reintentos
        })
        .finally(() => setLoading(false));
    } else if (email) {
      setMensaje(`Hemos enviado un email a ${email}`);
    }
  }, [token, email, verificado]);


  const reenviarCorreo = () => {
    if (!email) return;

    setLoading(true);
    api.apiPost(`/auth/reenviar-verificacion?email=${email}`)
      .then(() => setMensaje("Correo reenviado correctamente."))
      .catch((err) => setMensaje(err.response?.data || "Error reenviando correo"))
      .finally(() => setLoading(false));
  };

  const continuar = () => {
    navigate("/login");
  };

  return (
    <div className="verificacion-page">
      <div className="verificacion-container">

        <h2>Verificación de cuenta</h2>

        <p className="mensaje-email">{mensaje}</p>

        {loading && <div className="loader"></div>}

        {!token && (
          <>
            <p className="esperando">Esperando verificación...</p>

            <div className="botones-row">
              <button className="btn-reenviar" onClick={reenviarCorreo}>
                Reenviar correo
              </button>

              <button className="btn-continuar" onClick={continuar}>
                Continuar
              </button>
            </div>
          </>
        )}

        {token && (
          <button className="btn-continuar" onClick={continuar}>
            Ir al login
          </button>
        )}

      </div>
    </div>
  );
}