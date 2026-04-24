import { useEffect, useState } from "react";
import api from "../../api/api";
import PublicacionTarjeta from "./PublicacionTarjeta";
import CrearPublicacion from "./CrearPublicacion"; 
import "./Feed.css";

export default function Feed() {
  const [publicaciones, setPublicaciones] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));

  const cargarPublicaciones = async () => {
    try {
      const res = await api.apiGet("/publicaciones");
      setPublicaciones(Array.isArray(res) ? res : []);
    } catch (err) {
      console.error("Error cargando publicaciones:", err);
      setError("Error cargando publicaciones");
    } finally {
      setCargando(false);
    }
  };
  
  useEffect(() => {
    cargarPublicaciones();
  }, []);

  // Eliminar publicación
  const handleEliminar = async (idPublicacion) => {
    try {
      // Llamada al DELETE del backend que creamos antes
      await api.apiDelete(`/publicaciones/${idPublicacion}?idUsuario=${user.idUsuario}`);
      
      setPublicaciones((prev) => 
        prev.filter((p) => p.idPublicacion !== idPublicacion)
      );
    } catch (e) {
      console.error("Error al eliminar la publicación:", e);
      alert("No se pudo eliminar la publicación");
    }
  };

  const agregarPublicacion = (nuevaPub) => {
    setPublicaciones((prev) => [
      { ...nuevaPub, listaComentarios: [] },
      ...prev
    ]);
  };


  const handleLike = async (idPublicacion) => {
    try {
      const respuesta = await api.apiPost(
        `/publicaciones/${idPublicacion}/like?idUsuario=${user.idUsuario}`,
        {}, 
        true 
      );

      // Extraemos el booleano del objeto que manda Java
      const estaLikeado = respuesta.liked;
      if (estaLikeado === undefined) return;

      // if (liked === undefined) return;

      setPublicaciones((prev) =>
        prev.map((p) =>
          p.idPublicacion === idPublicacion
            ? { 
              ...p, 
              // Si es true sumamos 1, si es false restamos 1
              likes: estaLikeado ? p.likes + 1 : Math.max(0, p.likes - 1), 
              likedByUser: estaLikeado 
            }
          : p
        )
      );
    } catch (e) {
      console.error("Error dando like:", e);
    }
  }; 


  const handleComentar = async (idPublicacion, texto) => {
    try {
      await api.apiPost(
        `/publicaciones/${idPublicacion}/comentarios?idUsuario=${user.idUsuario}&texto=${encodeURIComponent(texto)}`
      );

      setPublicaciones((prev) =>
        prev.map((p) =>
          p.idPublicacion === idPublicacion
            ? {
                ...p,
                comentarios: p.comentarios + 1,
                listaComentarios: [
                  ...(p.listaComentarios || []),
                  {
                    texto,
                    usuarioNombre: user.nombre,
                    fecha: "Justo ahora"
                  }
                ]
              }
            : p
        )
      );
    } catch (e) {
      console.error("Error comentando:", e);
    }
  };

  if (cargando) return <p className="feed-loading">Cargando publicaciones...</p>;
  if (error) return <p className="feed-error">{error}</p>;

  return (
    <div className="feed-container">
      <CrearPublicacion onPublicada={agregarPublicacion} />

      {publicaciones.length === 0 ? (
        <p className="feed-vacio">No hay publicaciones todavía</p>
      ) : (
        publicaciones.map((pub) => (
          <PublicacionTarjeta
            key={pub.idPublicacion}
            publicacion={pub}
            onLike={handleLike}
            onComentar={handleComentar}
            onEliminar={handleEliminar}
          />
        ))
      )}
    </div>
  );
}
console.log("PRUEBA GITHUB");