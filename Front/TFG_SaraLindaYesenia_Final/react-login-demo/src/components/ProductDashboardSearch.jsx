import { useEffect, useRef, useState } from 'react';
import { Search } from 'lucide-react';
import { getProductoImagen } from '../utils/historialProductos';
import './ProductDashboardSearch.css';

export default function ProductDashboardSearch({
  value,
  onChange,
  results,
  loading,
  onSelect,
}) {
  const blurTimeoutRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!value.trim()) {
      setIsOpen(false);
      return;
    }
    setIsOpen(true);
  }, [value]);

  const buildSubtitle = (producto) =>
    producto?.autor ??
    producto?.marca?.nombreMarca ??
    producto?.genero?.nombreGenero ??
    producto?.categoria?.nombreCategoria ??
    producto?.tipo_producto ??
    'Producto';

  return (
    <div className="search-wrapper mb-3 dashboard-search-wrapper">
      <Search size={15} className="search-icon" />
      <input
        placeholder="Buscar por nombre, autor, marca..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="input-field search-input"
        onBlur={() => {
          blurTimeoutRef.current = setTimeout(() => {
            setIsOpen(false);
          }, 150);
        }}
        onFocus={() => {
          if (blurTimeoutRef.current) {
            clearTimeout(blurTimeoutRef.current);
          }
          if (value.trim()) {
            setIsOpen(true);
          }
        }}
      />

      {isOpen && (
        <div
          className="search-suggestions dashboard-search-suggestions"
          onMouseDown={() => {
            if (blurTimeoutRef.current) {
              clearTimeout(blurTimeoutRef.current);
            }
          }}
        >
          {loading ? (
            <div className="search-suggestion-empty">Buscando productos...</div>
          ) : results.length === 0 ? (
            <div className="search-suggestion-empty">No se encontraron productos.</div>
          ) : (
            results.slice(0, 8).map((producto) => {
              const imagen = getProductoImagen(producto);
              return (
                <button
                  key={producto.idProducto ?? producto.id}
                  type="button"
                  className="search-suggestion-item"
                  onClick={() => {
                    setIsOpen(false);
                    onSelect(producto);
                  }}
                >
                  <div className="search-suggestion-thumb">
                    {imagen ? (
                      <img src={imagen} alt={producto.nombreProducto} />
                    ) : (
                      <div className="search-suggestion-thumb-fallback">
                        {(producto.nombreProducto ?? '?').slice(0, 1)}
                      </div>
                    )}
                  </div>
                  <div className="search-suggestion-info">
                    <span className="search-suggestion-title">{producto.nombreProducto}</span>
                    <span className="search-suggestion-subtitle">{buildSubtitle(producto)}</span>
                  </div>
                </button>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
