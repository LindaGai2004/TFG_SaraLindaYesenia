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

  // 🔥 ESTE ES EL FIX IMPORTANTE
  const agregarPublicacion = async (nuevaPub) => {
    if (!nuevaPub) {
      // backend no devuelve → recargar todo
      await cargarPublicaciones();
      return;
    }

    // si backend sí devuelve → añadir arriba
    setPublicaciones((prev) => [
      { ...nuevaPub, listaComentarios: [] },
      ...prev
    ]);
  };

  const handleEliminar = async (idPublicacion) => {
    try {
      await api.apiDelete(`/publicaciones/${idPublicacion}?idUsuario=${user.idUsuario}`);
      setPublicaciones((prev) =>
        prev.filter((p) => p.idPublicacion !== idPublicacion)
      );
    } catch (e) {
      console.error("Error al eliminar:", e);
    }
  };

  const handleLike = async (idPublicacion) => {
    try {
      const res = await api.apiPost(
        `/publicaciones/${idPublicacion}/like?idUsuario=${user.idUsuario}`,
        {},
        true
      );

      const liked = res.liked;
      if (liked === undefined) return;

      setPublicaciones((prev) =>
        prev.map((p) =>
          p.idPublicacion === idPublicacion
            ? {
                ...p,
                likes: liked ? p.likes + 1 : Math.max(0, p.likes - 1),
                likedByUser: liked
              }
            : p
        )
      );
    } catch (e) {
      console.error("Error like:", e);
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

  if (cargando) return <p>Cargando...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="feed-container">
      <CrearPublicacion onPublicada={agregarPublicacion} />

      {publicaciones.map((pub) => (
        <PublicacionTarjeta
          key={pub.idPublicacion}
          publicacion={pub}
          onLike={handleLike}
          onComentar={handleComentar}
          onEliminar={handleEliminar}
        />
      ))}
    </div>
  );
}
console.log("PRUEBA GITHUB");