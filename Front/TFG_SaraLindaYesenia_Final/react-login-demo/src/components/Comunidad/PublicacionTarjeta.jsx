import "./PublicacionTarjeta.css";
import { useState } from "react";
import { Link } from 'react-router-dom';

export default function PublicacionTarjeta({ publicacion, onLike, onComentar, onEliminar }) {
  const [comentario, setComentario] = useState("");
  const [mostrarComentarios, setMostrarComentarios] = useState(false);
  const [verTodos, setVerTodos] = useState(false);

  // Obtenemos el usuario logueado desde el localStorage
  const user = JSON.parse(localStorage.getItem("user"));
  const esDuenio = user && user.nombre === publicacion.usuarioNombre;
  const esAdmin = user && user.perfil?.idPerfil === 1;

  // Mostrar solo los primeros 3 si no está expandido
  const comentariosVisibles = verTodos
    ? publicacion.listaComentarios || []
    : (publicacion.listaComentarios || []).slice(0, 3);

  return (
    <div className="publicacion-tarjeta">

      {/* Cabecera */}
      <div className="publicacion-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <img
            src={
              publicacion.usuarioAvatar
                ? `http://localhost:9001${publicacion.usuarioAvatar}`
                : "/assets/default-user.png"
            }
            alt="avatar"
            className="publicacion-avatar"
          />

          <div className="publicacion-info">
            <span className="publicacion-usuario">{publicacion.usuarioNombre}</span>
            <span className="publicacion-fecha">{publicacion.fecha}</span>
          </div>
        </div>

        
        {/* BOTÓN ELIMINAR */}
        {(esDuenio || esAdmin) && (
          <button 
            className="btn-eliminar"
            onClick={() => {
              if(window.confirm("¿Estás seguro de que quieres borrar esta publicación?")) {
                onEliminar(publicacion.idPublicacion);
              }
            }}
          >
            <img 
              src="/eliminar_blanco.png" 
              alt="Eliminar" 
              className="icono-accion"
            />
          </button>
        )}
      </div>

      {/* Texto */}
      {publicacion.texto && (
        <p className="publicacion-texto">{publicacion.texto}</p>
      )}

      {/* Imagen */}
      {publicacion.imagen && (
        <div className="publicacion-imagen">
          <img
            src={`http://localhost:9001${publicacion.imagen}`}
            alt="imagen publicación"
          />
        </div>
      )}


      {/* Enlace al detalle del producto */}
      {publicacion.idProducto && (
        <div className="enlace-producto-contenedor">
          <img 
              src="/libro-enlace.png" 
              alt="Libro" 
              className="img-libro-enlace"
            />
          <Link 
            to={`/producto/${publicacion.idProducto}`} 
            className="enlace-producto-detalle"
          >
            <strong>{publicacion.nombreProducto}</strong>
          </Link>
        </div>
      )}
      

      {/* Reacciones */}
      <div className="publicacion-acciones">

        {/* Botón Like */}
        <button
          className={`btn-accion ${publicacion.likedByUser ? "liked" : ""}`}
          onClick={() => onLike(publicacion.idPublicacion)}
        >
          <img
            src={publicacion.likedByUser ? "/corazon_lleno.png" : "/corazon_vacio.png"}
            alt="like"
            className="icono-accion"
          />
          <span className={publicacion.likedByUser ? "count-liked" : ""}>
            {publicacion.likes}
          </span>
        </button>

        {/* Botón Comentarios */}
        <button
          className="btn-accion"
          onClick={() => setMostrarComentarios(!mostrarComentarios)}
        >
          <img
            src="/comentario.png"
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

          {/* Botón "ver más" si hay más de 3 comentarios */}
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