import "./PublicacionTarjeta.css";
import { useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import { getApiUrl } from "../../api/api";
import { useAuth } from "../../context/AuthContext";

export default function PublicacionTarjeta({ publicacion, onLike, onComentar, onEliminar }) {
  const [comentario, setComentario] = useState("");
  const [mostrarComentarios, setMostrarComentarios] = useState(false);
  const [verTodos, setVerTodos] = useState(false);

  // Obtenemos el usuario logueado desde el localStorage
  //const user = JSON.parse(localStorage.getItem("user"));
  const { user } = useAuth();
  const navigate = useNavigate();
  const miAvatar = user?.avatar ?? user?.fotoPerfil ?? user?.imagenPerfil ?? "";

  const esDuenio = user && user.nombre === publicacion.usuarioNombre;
  const esAdmin = user && user.perfil?.idPerfil === 1;

  // --- CAMBIO 1: Mostrar solo el ÚLTIMO si no está expandido ---
  const comentariosVisibles = verTodos
    ? publicacion.listaComentarios || []
    : (publicacion.listaComentarios || []).slice(-1); // Muestra el último comentario

  return (
    <div className="publicacion-tarjeta">

      {/* Cabecera */}
      <div className="publicacion-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <img
            src={publicacion.usuarioAvatar ? getApiUrl(publicacion.usuarioAvatar) : "/assets/default-user.png"}
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
            src={getApiUrl(publicacion.imagen)}
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

      {/* Bloque de Comentarios */}
      {mostrarComentarios && (
        <div className="comentarios-box">
          
          {/* Input con tu avatar conectado */}
          <div className="comentario-input-wrapper">
            <img 
              src={miAvatar ? getApiUrl(miAvatar) : "/assets/default-user.png"} 
              alt="mi avatar" 
              className="avatar-comentario-input" 
            />
            <div className="comentario-input">
              <input
                type="text"
                placeholder="Escribe un comentario..."
                value={comentario}
                onChange={(e) => setComentario(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && comentario.trim()) {
                      onComentar(publicacion.idPublicacion, comentario);
                      setComentario("");
                  }
                }}
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

          {/* Lista de comentarios con avatar y orden inverso */}
          <div className="lista-comentarios">
            {[...comentariosVisibles].reverse().map((c, i) => (
              <div key={i} className="comentario-item-contenedor">
                <img 
                  src={c.usuarioAvatar ? getApiUrl(c.usuarioAvatar) : "/assets/default-user.png"} 
                  alt="avatar" 
                  className="avatar-comentario-mini" 
                />
                <div className="cuerpo-comentario">
                  <div className="burbuja-comentario">
                    <strong>{c.usuarioNombre}</strong>
                    <p>{c.texto}</p>
                  </div>
                  <span className="comentario-fecha">{c.fecha}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Botón dinámico de ver más/menos */}
          {publicacion.listaComentarios?.length > 1 && (
            <button
              className="btn-ver-mas-comunidad"
              onClick={() => setVerTodos(!verTodos)}
            >
              {verTodos 
                ? "Ver menos ▲" 
                : `Ver los otros comentarios ▼`
              }
            </button>
          )}

          {publicacion.listaComentarios?.length === 0 && (
            <p className="txt-sin-comentarios">Sé el primero en comentar...</p>
          )}
        </div>
      )}

    </div>
  );
}