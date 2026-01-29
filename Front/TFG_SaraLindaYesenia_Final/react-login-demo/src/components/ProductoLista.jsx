import "./ProductoLista.css";

export default function ProductoLista({ productos }) {

  if (!productos || productos.length === 0) {
    return <p className="sin-resultados">No hay productos que coincidan con la búsqueda.</p>;
  }

  return (
    <div className="producto-grid">
      {productos.map((p) => (
        <div key={p.idProducto} className="producto-card">

          {/* Imagen */}
          <div className="producto-imagen">
            <img
              src={p.imagen || "https://via.placeholder.com/200x200?text=Producto"}
              alt={p.nombre}
            />
          </div>

          {/* Icono de favorito */}
          <button className="favorito-btn">
            <img src="/corazon.jpg" alt="Favorito" className="favorito-icon"/>
          </button>

          {/* Información */}
          <div className="producto-info">
            <h3 className="producto-titulo">{p.nombreProducto}</h3>

            {/* Si es libro */}
            {p.autor && (
              <p className="producto-sub">{p.autor}</p>
            )}

            {/* Si es papelería */}
            {!p.autor && p.categoria && p.marca && (
              <p className="producto-sub">
                {p.categoria.nombreCategoria} · {p.marca.nombreMarca}
              </p>
            )}

            <p className="producto-precio">{p.precio} €</p>
          </div>
        </div>
      ))}
    </div>
  );
}