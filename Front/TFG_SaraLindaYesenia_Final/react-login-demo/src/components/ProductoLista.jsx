import "./ProductoLista.css";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { imagenesLibros, imagenesPapeleria } from "../data/imagenes.js";

export default function ProductoLista({ productos }) {

  const [favoritos, setFavoritos] = useState({});
  const { user } = useAuth();

  // estado para la notificación
  const [mensaje, setMensaje] = useState("");

  // Cargar favoritos reales del backend al iniciar
  useEffect(() => {
    const fetchFavoritos = async () => {
      try {
        const res = await fetch(`http://localhost:9001/usuarios/favoritos`, {
          credentials: "include"
        });
        const data = await res.json();

        // Convertimos la lista en un diccionario { idProducto: true }
        const favMap = {};
        data.forEach(f => favMap[f.idProducto] = true);

        setFavoritos(favMap);
      } catch (error) {
        console.error("Error cargando favoritos:", error);
      }
    };

    fetchFavoritos();
  }, [user.idUsuario]);

  const toggleFavorito = async (idProducto) => {
    const esFavorito = favoritos[idProducto];

    try {
      if (esFavorito) {
        // ELIMINAR FAVORITO
        await fetch(`http://localhost:9001/usuarios/favoritos/${idProducto}`, {
          method: "DELETE",
          credentials: "include"
        });

        setMensaje("Eliminado de favoritos");

      } else {
        // AÑADIR FAVORITO
        await fetch(`http://localhost:9001/usuarios/favoritos/${idProducto}`, {
          method: "POST",
          credentials: "include"
        });

        setMensaje("Añadido a favoritos");
      }

      // Ocultar mensaje después de 2 segundos
      setTimeout(() => setMensaje(""), 2000);

      // Actualizar icono en pantalla
      setFavoritos(prev => ({
        ...prev,
        [idProducto]: !prev[idProducto]
      }));

    } catch (error) {
      console.error("Error al actualizar favorito:", error);
    }
  };

  if (!productos || productos.length === 0) {
    return <p className="sin-resultados">No hay productos que coincidan con la búsqueda.</p>;
  }

  return (
    <>
      {mensaje && <div className="notificacion-toast">{mensaje}</div>}

      <div className="producto-grid">
        {productos.map((p) => (
          <div key={p.idProducto} className="producto-card">

            {/* ZONA CLICABLE QUE ABRE EL DETALLE */}
            <Link to={`/producto/${p.idProducto}`} className="producto-link">

              {/* Imagen */}
              <div className="producto-imagen">
                <img
                  src={
                    p.tipo_producto === "LIBRO"
                      ? imagenesLibros[p.idProducto]?.portada
                      : imagenesPapeleria[p.idProducto]
                  }
                  alt={p.nombreProducto}
                />
              </div>

              {/* Información */}
              <div className="producto-info">
                <h3 className="producto-titulo">{p.nombreProducto}</h3>

                {p.autor && (
                  <p className="producto-sub">{p.autor}</p>
                )}

                {!p.autor && p.categoria && p.marca && (
                  <p className="producto-sub">
                    {p.categoria.nombreCategoria} · {p.marca.nombreMarca}
                  </p>
                )}

                <p className="producto-precio">{p.precio} €</p>
              </div>

            </Link>

            {/* Icono de favorito */}
            <button className="favorito-btn" onClick={() => toggleFavorito(p.idProducto)}>
              <img
                src={favoritos[p.idProducto] ? "/corazon-lleno.png" : "/corazon.jpg"}
                alt="Favorito"
                className="favorito-icon"
              />
            </button>

            {/* Botón Añadir al carrito */}
            <Link to="/MiCarrito" className="carrito-overlay-btn">
              Añadir al carrito
            </Link>

          </div>
        ))}
      </div>
    </>
  );
}