import { useEffect, useState } from "react";
import { apiDelete, apiGet } from "../api/api";
import "./favoritos.css";

export default function Favoritos() {
  const [favoritos, setFavoritos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFavoritos = async () => {
      try {
        const data = await apiGet("/usuarios/favoritos");
        setFavoritos(data || []);
      } catch (error) {
        console.error("Error cargando favoritos:", error);
        setFavoritos([]);
      } finally {
        setLoading(false);
      }
    };
    fetchFavoritos();
  }, []);

  const removeFavorito = async (idProducto) => {
    try {
      await apiDelete(`/usuarios/favoritos/${idProducto}`);
      setFavoritos(prev => prev.filter(f => f.idProducto !== idProducto));
    } catch (error) {
      console.error("Error eliminando favorito:", error);
    }
  };

  if (loading) {
    return <p className="favoritos-cargando">Cargando favoritos...</p>;
  }

  return (
    <div className="favoritos-container">
      <h2 className="favoritos-titulo">Mis Favoritos</h2>

      {favoritos.length === 0 ? (
        <p className="favoritos-vacio">No tienes productos en favoritos todavía.</p>
      ) : (
        <div className="favoritos-lista">
          {favoritos.map(fav => {

            // Obtener imagen principal desde el backend
            let imagen = "";

            if (fav.imagenes && fav.imagenes.length > 0) {
              const principal = fav.imagenes.find(img => img.tipo === "PRINCIPAL") || fav.imagenes[0];
              imagen = `http://localhost:9001/uploads/${principal.ruta}`;
            }

            return (
              <div key={fav.idProducto} className="favorito-card">

                {/* IMAGEN */}
                <div className="favorito-imagen">
                  <img src={imagen} alt={fav.nombreProducto} />
                </div>

                {/* INFO */}
                <div className="favorito-info">
                  <h3 className="favorito-nombre">{fav.nombreProducto}</h3>

                  <p className="favorito-sub">
                    {fav.tipo_producto === "LIBRO"
                      ? fav.autor || "Autor desconocido"
                      : fav.marca?.nombreMarca || "Marca desconocida"}
                  </p>

                  <p className="favorito-precio">{fav.precio} €</p>

                  <div className="favorito-botones">
                    <button className="btn-fav-carrito">
                      Añadir al carrito
                    </button>

                    <button
                      className="btn-fav-eliminar"
                      onClick={() => removeFavorito(fav.idProducto)}
                    >
                      Eliminar
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}