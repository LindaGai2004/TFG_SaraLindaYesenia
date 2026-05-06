import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import { useCart } from "../../context/CartContext.jsx";
import {apiGet, apiPost, apiDelete} from "../../api/api.js";
import "./ProductoLista.css";
import ProductoImagenes from "./ProductoImagenes";

export default function ProductoLista({ productos }) {

  const [favoritos, setFavoritos] = useState({});
  const { user } = useAuth();

  // estado para la notificación
  const [mensaje, setMensaje] = useState("");

  const [mostrarAvisoFavorito, setMostrarAvisoFavorito] = useState(false);
  const [mostrarAvisoCarrito, setMostrarAvisoCarrito] = useState(false);

  const { addToCart } = useCart();

  // Cargar favoritos reales del backend al iniciar
  useEffect(() => {
    if (!user) return; // evita el error cuando no estás logueada
  
    const fetchFavoritos = async () => {
      try {
        const data = await apiGet("/usuarios/favoritos");
        const favMap = {};
        data.forEach(f => favMap[f.idProducto] = true);
        setFavoritos(favMap);
      } catch (error) {
        console.error("Error cargando favoritos:", error);
      }
    };
  
    fetchFavoritos();
  }, [user]);  

  const toggleFavorito = async (idProducto) => {
    if (!user) {
      setMostrarAvisoFavorito(true);
      return;
    }

    const esFavorito = favoritos[idProducto];

    try {
      if (esFavorito) {
        await apiDelete(`/usuarios/favoritos/${idProducto}`);
        setMensaje("Eliminado de favoritos");
      } else {
        await apiPost(`/usuarios/favoritos/${idProducto}`);
        setMensaje("Guardado en favoritos");
      }

      setFavoritos(prev => ({
        ...prev,
        [idProducto]: !prev[idProducto]
      }));
      setTimeout(() => setMensaje(""), 2000);

    } catch (error) {
      console.error("Error al actualizar favorito:", error);
    }
  };

  if (!productos || productos.length === 0) {
    return <p className="sin-resultados">No hay productos que coincidan con la búsqueda.</p>;
  }

  return (
    <>
      {mostrarAvisoFavorito && (
        <div className="notificacion-login">
          <p>Debes iniciar sesión para guardar favoritos.</p>

          <div className="notificacion-botones">
            <a href="/login" className="btn-login-aviso">Ir al login</a>
            <button
              className="btn-cerrar-aviso"
              onClick={() => setMostrarAvisoFavorito(false)}
            >
              Cerrar
            </button>
          </div>
        </div>
      )}

      {mostrarAvisoCarrito && (
        <div className="notificacion-login">
          <p>Debes iniciar sesión para añadir productos al carrito.</p>
          <div className="notificacion-botones">
            <a href="/login" className="btn-login-aviso">Ir al login</a>
            <button 
              className="btn-cerrar-aviso" 
              onClick={() => setMostrarAvisoCarrito(false)}
            >
              Cerrar
            </button>
          </div>
        </div>
      )}

      {mensaje && (
        <div className="notificacion-login">
          <p>{mensaje}</p>
          <div className="notificacion-botones">
            <button 
              className="btn-cerrar-aviso" 
              onClick={() => setMensaje("")}
            >
              Cerrar
            </button>
          </div>
        </div>
      )}

      <div className="producto-grid">
        {productos.map((p) => (
          <div key={p.idProducto} className="producto-card">

            {/* ZONA CLICABLE QUE ABRE EL DETALLE */}
            <Link to={`/producto/${p.idProducto}`} className="producto-link">

              {/* Imagen */}
              <div className="producto-imagen">
                <ProductoImagenes imagenes={p.imagenes} modo="simple" />
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

                <div className="producto-meta">
                  <p className="producto-precio">{p.precio} €</p>
                  
                  <div className="producto-rating">
                    <span className="estrella-mini">★</span>
                    <span>
                      {p.calificacionMedia !== null && p.calificacionMedia !== undefined 
                        ? Number(p.calificacionMedia).toFixed(1) 
                        : "0.0"}
                    </span>
                  </div>
                </div>
              </div>

            </Link>

            {/* Icono de favorito */}
            <button className="favorito-btn" onClick={() => toggleFavorito(p.idProducto)}>
              <img
                src={favoritos[p.idProducto] ? "/corazon_lleno.png" : "/corazon_vacio.png"}
                alt="Favorito"
                className="favorito-icon"
              />
            </button>

            {/* Botón Añadir al carrito */}
            <button
              className="carrito-overlay-btn"
              onClick={() => {
                if (!user) {
                  setMostrarAvisoCarrito(true);
                  return;
                }

                addToCart(p.idProducto, 1);

                setMensaje(`¡Producto añadido al carrito!`);
          
                // Limpiar el mensaje después de 2 segundos
                setTimeout(() => {
                  setMensaje("");
                }, 2000);
              }}
            >
              Añadir al carrito
            </button>
          </div>
        ))}
      </div>
    </>
  );
}