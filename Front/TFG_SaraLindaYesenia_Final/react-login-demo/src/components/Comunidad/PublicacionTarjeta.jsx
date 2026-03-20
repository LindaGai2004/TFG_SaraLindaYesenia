import "./PublicacionTarjeta.css";
import { useState } from "react";

export default function PublicacionTarjeta({ publicacion, onLike, onComentar }) {
  const [comentario, setComentario] = useState("");
  const [mostrarComentarios, setMostrarComentarios] = useState(false);

  return (
    <div className="publicacion-tarjeta">

      {/* Cabecera */}
      <div className="publicacion-header">
        <img
          src={publicacion.usuarioAvatar || "/assets/default-user.png"}
          alt="avatar"
          className="publicacion-avatar"
        />

        <div className="publicacion-info">
          <span className="publicacion-usuario">{publicacion.usuarioNombre}</span>
          <span className="publicacion-fecha">{publicacion.fecha}</span>
        </div>
      </div>

      {/* Texto */}
      {publicacion.texto && (
        <p className="publicacion-texto">{publicacion.texto}</p>
      )}

      {/* Imagen */}
      {publicacion.imagen && (
        <div className="publicacion-imagen">
          <img src={publicacion.imagen} alt="imagen publicación" />
        </div>
      )}

      {/* Reacciones */}
      <div className="publicacion-acciones">
        <button className="btn-accion" onClick={() => onLike(publicacion.id)}>
          ❤️ {publicacion.likes}
        </button>

        <button
          className="btn-accion"
          onClick={() => setMostrarComentarios(!mostrarComentarios)}
        >
          💬 {publicacion.comentarios}
        </button>
      </div>

      {/* Comentarios */}
      {mostrarComentarios && (
        <div className="comentarios-box">
          <input
            type="text"
            placeholder="Escribe un comentario..."
            value={comentario}
            onChange={(e) => setComentario(e.target.value)}
          />

          <button
            className="btn-enviar"
            onClick={() => {
              onComentar(publicacion.id, comentario);
              setComentario("");
            }}
          >
            Enviar
          </button>
        </div>
      )}

    </div>
  );
}