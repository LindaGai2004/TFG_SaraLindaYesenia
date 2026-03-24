import "./PublicacionTarjeta.css";
import { useState } from "react";

export default function PublicacionTarjeta({ publicacion, onLike, onComentar }) {
  const [comentario, setComentario] = useState("");
  const [mostrarComentarios, setMostrarComentarios] = useState(false);
  const [verTodos, setVerTodos] = useState(false);

  // Mostrar solo los primeros 3 si no está expandido
  const comentariosVisibles = verTodos
    ? publicacion.listaComentarios || []
    : (publicacion.listaComentarios || []).slice(0, 3);

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

        {/* Botón Like con imagen */}
        <button
          className="btn-accion"
          onClick={() => onLike(publicacion.idPublicacion)}
        >
          <img
            src="/assets/icons/like.png"
            alt="like"
            className="icono-accion"
          />
          {publicacion.likes}
        </button>

        {/* Botón Comentarios con imagen */}
        <button
          className="btn-accion"
          onClick={() => setMostrarComentarios(!mostrarComentarios)}
        >
          <img
            src="/assets/icons/comment.png"
            alt="comentarios"
            className="icono-accion"
          />
          {publicacion.comentarios}
        </button>
      </div>

      {/* Comentarios */}
      {mostrarComentarios && (
        <div className="comentarios-box">

          {/* Lista de comentarios */}
          {comentariosVisibles.map((c, i) => (
            <div key={i} className="comentario-item">
              <strong>{c.usuarioNombre}:</strong> {c.texto}
              <span className="comentario-fecha">{c.fecha}</span>
            </div>
          ))}

          {/* Botón "ver más" si hay más de 3 */}
          {publicacion.listaComentarios?.length > 3 && !verTodos && (
            <button
              className="btn-ver-mas"
              onClick={() => setVerTodos(true)}
            >
              Ver más comentarios ▼
            </button>
          )}

          {/* Botón "ver menos" */}
          {verTodos && (
            <button
              className="btn-ver-mas"
              onClick={() => setVerTodos(false)}
            >
              Ver menos ▲
            </button>
          )}

          {/* Input para escribir comentario */}
          <div className="comentario-input">
            <input
              type="text"
              placeholder="Escribe un comentario..."
              value={comentario}
              onChange={(e) => setComentario(e.target.value)}
            />

            <button
              className="btn-enviar"
              onClick={() => {
                if (!comentario.trim()) return;
                onComentar(publicacion.idPublicacion, comentario);
                setComentario("");
              }}
            >
              Enviar
            </button>
          </div>
        </div>
      )}

    </div>
  );
}