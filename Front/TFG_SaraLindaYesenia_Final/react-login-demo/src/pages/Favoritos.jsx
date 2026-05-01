import { useEffect, useState } from "react";
import { apiDelete, apiGet } from "../api/api";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import "./favoritos.css";

export default function Favoritos() {
  const [favoritos, setFavoritos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mensaje, setMensaje] = useState("");
  const { addToCart } = useCart();
  const { user } = useAuth();   // para evitar llamadas sin token
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      setFavoritos([]); 
      setLoading(false);
      return;
    }

    const fetchFavoritos = async () => {
      try {
        const data = await apiGet("/usuarios/favoritos");
        setFavoritos(Array.isArray(data) ? data : []);
      } catch (error) {
        console.warn("No se pudieron cargar favoritos (usuario no logueado)");
        setFavoritos([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFavoritos();
  }, [user]);

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
    <>
      {mensaje && <div className="notificacion-toast">{mensaje}</div>}
      <div className="favoritos-container">
        <h2 className="favoritos-titulo">Mis Favoritos</h2>

        {favoritos.length === 0 ? (
          <p className="favoritos-vacio">No tienes productos en favoritos todavía.</p>
        ) : (
          <div className="favoritos-lista">
            {favoritos.map(fav => {
              let imagen = "";

              if (fav.imagenes && fav.imagenes.length > 0) {
                const principal = fav.imagenes.find(img => img.tipo === "PRINCIPAL") || fav.imagenes[0];
                imagen = `http://localhost:9001/uploads/${principal.ruta}`;
              }

              return (
                <div
                  key={fav.idProducto}
                  className="favorito-card"
                  onClick={() => navigate(`/producto/${fav.idProducto}`)}
                >
                  <div className="favorito-imagen">
                    <img src={imagen} alt={fav.nombreProducto} />
                  </div>

                  <div className="favorito-info">
                    <h3 className="favorito-nombre">{fav.nombreProducto}</h3>

                    <p className="favorito-sub">
                      {fav.tipo_producto === "LIBRO"
                        ? fav.autor || "Autor desconocido"
                        : fav.marca?.nombreMarca || "Marca desconocida"}
                    </p>

                    <p className="favorito-precio">{fav.precio} €</p>

                    <div className="favorito-botones">
                      <button
                        className="btn-fav-carrito"
                        onClick={(e) => {
                          e.stopPropagation();
                          addToCart(fav.idProducto, 1);
                          setMensaje("Producto añadido al carrito");
                          setTimeout(() => setMensaje(""), 2000);
                        }}
                      >
                        Añadir al carrito
                      </button>

                      <button
                        className="btn-fav-eliminar"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeFavorito(fav.idProducto);
                        }}
                      >
                        <img
                          src="/eliminar_blanco.png"
                          alt="Eliminar"
                          className="icono-eliminar"
                        />
                      </button>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}