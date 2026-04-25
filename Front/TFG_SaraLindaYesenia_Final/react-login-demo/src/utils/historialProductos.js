const HISTORIAL_KEY = "bn_historial";
const HISTORIAL_MAX = 20;
const FALLBACK_COLORS = [
  "linear-gradient(135deg,#4a7c45,#7ec47a)",
  "linear-gradient(135deg,#8b2020,#d94f4f)",
  "linear-gradient(135deg,#2d3a6e,#7c8dcf)",
];

export function getHistorial() {
  try {
    return JSON.parse(localStorage.getItem(HISTORIAL_KEY)) || [];
  } catch {
    return [];
  }
}

export function guardarEnHistorial(producto) {
  const historial = getHistorial().filter(
    (item) => String(item.id) !== String(producto.id)
  );
  const nuevo = [producto, ...historial].slice(0, HISTORIAL_MAX);
  localStorage.setItem(HISTORIAL_KEY, JSON.stringify(nuevo));
}

export function limpiarHistorial() {
  localStorage.removeItem(HISTORIAL_KEY);
}

export function getProductoImagen(producto) {
  const imagenPrincipal = producto?.imagenes?.find(
    (imagen) => imagen.tipo === "PRINCIPAL"
  );

  if (!imagenPrincipal?.ruta) {
    return null;
  }

  return `http://localhost:9001/uploads/${imagenPrincipal.ruta}`;
}

export function crearItemHistorial(producto, index = 0) {
  const id = producto?.idProducto ?? producto?.id;

  return {
    id,
    titulo: producto?.nombreProducto ?? producto?.nombre ?? "Producto",
    autor:
      producto?.autor ??
      producto?.marca?.nombreMarca ??
      producto?.marca ??
      producto?.categoria?.nombreCategoria ??
      producto?.tipo_producto ??
      producto?.tipo ??
      "Producto",
    imagen: getProductoImagen(producto) ?? producto?.imagen ?? null,
    color: producto?.color ?? FALLBACK_COLORS[index % FALLBACK_COLORS.length],
  };
}
