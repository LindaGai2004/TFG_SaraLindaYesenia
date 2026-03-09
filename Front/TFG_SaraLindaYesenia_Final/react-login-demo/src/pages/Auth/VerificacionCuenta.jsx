import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import "./VerificacionCuenta.css";

export default function VerificacionCuenta() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const email = params.get("email");

  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    setMensaje(`Hemos enviado un email a ${email}`);
  }, [email]);

  const reenviarCorreo = () => {
    // Aquí llamarías a tu endpoint para reenviar el correo
    setMensaje("Correo reenviado correctamente.");
  };

  const continuar = () => {
    navigate("/login");
  };

  return (
    <div className="verificacion-page">
      <div className="verificacion-container">

        <h2>¡Registro exitoso!</h2>

        <p className="mensaje-email">{mensaje}</p>

        <div className="loader"></div>

        <p className="esperando">Esperando verificación...</p>

        <div className="botones-row">
          <button className="btn-reenviar" onClick={reenviarCorreo}>
            Reenviar correo
          </button>

          <button className="btn-continuar" onClick={continuar}>
            Continuar
          </button>
        </div>

      </div>
    </div>
  );
}