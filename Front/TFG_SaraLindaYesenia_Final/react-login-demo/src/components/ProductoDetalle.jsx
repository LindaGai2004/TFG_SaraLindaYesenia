import { useParams } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import "./ProductoDetalle.css";

export default function ProductoDetalle() {
  const { id } = useParams();
  const [producto, setProducto] = useState(null);
  const [cantidad, setCantidad] = useState(1);
  const [relacionados, setRelacionados] = useState([]);
  const [expandido, setExpandido] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    fetch(`http://localhost:9001/productos/${id}`)
      .then(res => res.json())
      .then(data => {
        const base = {
          id: data.idProducto,
          nombre: data.nombreProducto,
          descripcion: data.descripcion,
          precio: data.precio,
          tipo: data.tipo_producto || data.tipo,
          imagen: data.imagen || "/lector1.jpg",
          miniaturas: [
            data.imagen || "/lector1.jpg",
            "/lector2.jpg",
            "/lector3.jpg"
          ],
          autor: null,
          isbn: null,
          numeroPaginas: null,
          idioma: null,
          resumen: null,
          editorial: null,
          fechaPublicacion: null,
          genero: null,
          marca: null,
          categoria: null
        };

        setProducto(base);

        // LIBRO
        if (base.tipo === "LIBRO") {
          fetch(`http://localhost:9001/libros/${id}`)
            .then(res => res.json())
            .then(libro => {
              setProducto(prev => ({
                ...prev,
                autor: libro.autor,
                isbn: libro.isbn,
                numeroPaginas: libro.numeroPagina,
                idioma: libro.idioma?.nombreIdioma,
                editorial: libro.editorial,
                fechaPublicacion: libro.fechaPublicacion,
                genero: libro.genero?.nombreGenero,
                resumen: libro.resumen || null
              }));
            });
        }

        // PAPELERÍA
        if (base.tipo === "PAPELERIA") {
          fetch(`http://localhost:9001/papelerias/${id}`)
            .then(res => res.json())
            .then(pap => {
              setProducto(prev => ({
                ...prev,
                marca: pap.marca?.nombreMarca,
                categoria: pap.categoria?.nombreCategoria
              }));
            });
        }
      });
  }, [id]);

  if (!producto) return <p>Cargando...</p>;

  const resumenCorto =
    producto.resumen && producto.resumen.length > 250
      ? producto.resumen.slice(0, 250) + "..."
      : producto.resumen;

  return (
    <div className="detalle-producto">

      {/* COLUMNA IZQUIERDA */}
      <div className="col-izquierda">
        <img src={producto.imagen} className="detalle-imagen" alt={producto.nombre} />

        <div className="detalle-miniaturas">
          {producto.miniaturas.map((mini, index) => (
            <img
              key={index}
              src={mini}
              alt="miniatura"
              onClick={() => setProducto({ ...producto, imagen: mini })}
            />
          ))}
        </div>
      </div>

      {/* COLUMNA CENTRAL */}
      <div className="col-central">
        <h2>{producto.nombre}</h2>

        {producto.autor && <p className="detalle-autor">{producto.autor}</p>}

        <p className="detalle-descripcion">{producto.descripcion}</p>

        {/* RESUMEN CON LEER MÁS / LEER MENOS */}
        {producto.resumen && (
          <div className="detalle-resumen-container">

            <p className="detalle-resumen">
              {expandido ? producto.resumen : resumenCorto}
            </p>

            {producto.resumen.length > 250 && (
              <button
                className="btn-leer-mas"
                onClick={() => setExpandido(!expandido)}
              >
                {expandido ? "Leer menos" : "Leer más"}
              </button>
            )}
          </div>
        )}

        <hr />

        <div className="detalle-extra">
          {producto.tipo === "LIBRO" && (
            <>
              <p><strong>ISBN:</strong> {producto.isbn}</p>
              <p><strong>Longitud de impresión:</strong> {producto.numeroPaginas}</p>
              <p><strong>Idioma:</strong> {producto.idioma}</p>
              <p><strong>Editorial:</strong> {producto.editorial}</p>
              <p><strong>Fecha publicación:</strong> {producto.fechaPublicacion}</p>
              <p><strong>Género:</strong> {producto.genero}</p>
            </>
          )}

          {producto.tipo === "PAPELERIA" && (
            <>
              <h3>Detalles del producto</h3>
              <p><strong>Marca:</strong> {producto.marca}</p>
              <p><strong>Categoría:</strong> {producto.categoria}</p>
            </>
          )}
        </div>
      </div>

      {/* COLUMNA DERECHA */}
      <div className="col-derecha">
        <div className="card-compra">

          {/* PRECIO */}
          <p className="precio-card">{producto.precio} €</p>

          {/* BOTÓN PRINCIPAL */}
          <button className="btn-cesta btn-grande">Añadir a la cesta</button>

          {/* INFORMACIÓN DE ENVÍO Y GARANTÍA */}
          <div className="info-envio">
            <p className="envio-item">Disponible en días</p>
            <p className="envio-item">Envío gratis a partir de 20 €</p>
            <p className="envio-item">Devolución gratuita 30 días</p>
            <p className="envio-item">Pago 100% seguro</p>
          </div>

          {/* BOTONES SECUNDARIOS EN DOS COLUMNAS */}
          <div className="botones-dos-columnas">
            <button className="btn-favoritos">Guardar</button>
            <button className="btn-carrito">Compartir</button>
          </div>

          <hr />

          {/* MÉTODOS DE PAGO */}
          <p className="envio-item">Métodos de pago: Visa · PayPal · Bizum</p>
          <p className="envio-item">Recogida en tienda disponible</p>

        </div>
      </div>

    </div>
  );
}