import "./ProductoLista.css";
import { Link } from "react-router-dom";
import { useState } from "react";

export default function ProductoLista({ productos }) {

  const [favoritos, setFavoritos] = useState({});

  const toggleFavorito = (id) => {
    setFavoritos((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  if (!productos || productos.length === 0) {
    return <p className="sin-resultados">No hay productos que coincidan con la búsqueda.</p>;
  }

  return (
    <div className="producto-grid">
      {productos.map((p) => (
        <div key={p.idProducto} className="producto-card">

          {/* ZONA CLICABLE QUE ABRE EL DETALLE */}
          <Link to={`/producto/${p.idProducto}`} className="producto-link">

            {/* Imagen */}
            <div className="producto-imagen">
              <img
                src={p.imagen || "https://via.placeholder.com/200x200?text=Producto"}
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
          <Link to="/favoritos" className="favorito-btn">
            <img
              src={favoritos[p.idProducto] ? "/corazon-lleno.png" : "/corazon.jpg"}
              alt="Favorito"
              className="favorito-icon"
              onClick={(e) => {
                e.preventDefault(); // evita que te lleve a /favoritos
                toggleFavorito(p.idProducto);
              }}
            />
          </Link>

          {/* Botón Añadir al carrito */}
          <Link to="/MiCarrito" className="carrito-overlay-btn">
            Añadir al carrito
          </Link>

        </div>
      ))}
    </div>
  );
}