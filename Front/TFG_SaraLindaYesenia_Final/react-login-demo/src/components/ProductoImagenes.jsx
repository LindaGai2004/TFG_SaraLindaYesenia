import { useState } from "react";

export default function ProductoImagenes({ imagenes = [], modo = "completo" }) {
  if (!imagenes || imagenes.length === 0) {
    return <div className="imagen-placeholder">Sin imagen</div>;
  }

  // Imagen principal = la que tenga tipo "PRINCIPAL"
  const principal = imagenes.find(img => img.tipo === "PRINCIPAL") || imagenes[0];

  // Si estamos en modo simple -> SOLO mostrar la principal
  if (modo === "simple") {
    return (
      <img
        src={`http://localhost:9001/uploads/${principal.ruta}`}
        alt="Producto"
        className="producto-lista-imagen"
      />
    );
  }

  // MODO COMPLETO (detalle)
  const [imagenActual, setImagenActual] = useState(principal.ruta);
  const [miniaturaActiva, setMiniaturaActiva] = useState(
    imagenes.findIndex(img => img.ruta === principal.ruta)
  );

  const miniaturas = imagenes.filter(img => img.tipo !== "PRINCIPAL");

  return (
    <div className="galeria-producto">
      <div className="imagen-principal">
        <img
          src={`http://localhost:9001/uploads/${imagenActual}`}
          alt="Producto"
        />
      </div>

      <div className="miniaturas">
        {miniaturas.map((m, index) => (
          <img
            key={m.idImagen}
            src={`http://localhost:9001/uploads/${m.ruta}`}
            alt="Miniatura"
            className={miniaturaActiva === index ? "miniatura-activa" : ""}
            onClick={() => {
              setImagenActual(m.ruta);
              setMiniaturaActiva(index);
            }}
          />
        ))}
      </div>
    </div>
  );
}