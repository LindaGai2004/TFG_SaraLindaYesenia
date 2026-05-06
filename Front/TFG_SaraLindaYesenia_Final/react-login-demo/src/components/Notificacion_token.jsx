import "./Notificacion_token.css";

export default function NotificacionToken({ mensaje, onClose }) {
  if (!mensaje) return null;

  return (
    <div className="notificacion-login">
      <span>{mensaje}</span>

      <button 
        className="notificacion-cerrar"
        onClick={onClose}
      >
        Cerrar
      </button>
    </div>
  );
}