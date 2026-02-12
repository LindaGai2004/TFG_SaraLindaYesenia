import { useParams } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import "./ProductoDetalle.css";

export default function ProductoDetalle() {
  const { id } = useParams();
  const [producto, setProducto] = useState(null);
  const [expandido, setExpandido] = useState(false);

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

  const resumenCorto = producto.resumen && producto.resumen.length > 250 ? producto.resumen.slice(0, 250) + "..." : producto.resumen;

  return (
    <div className="detalle-producto">
  
      {/* ============================
          PRIMERA FILA (más estrecha)
      ============================ */}
      <div className="fila-superior dos-columnas">
  
        {/* COLUMNA IZQUIERDA */}
        <div className="col-izquierda">
          <div className="imagen-principal">
            <img src={producto.imagen} className="detalle-imagen" alt={producto.nombre} />
          </div>
  
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
  
        {/* COLUMNA DERECHA */}
        <div className="col-derecha-editorial">
  
          {/* TÍTULO + AUTOR + PRECIO */}
          <div className="editorial-header">
            <h1 className="titulo-editorial">{producto.nombre}</h1>
            {producto.autor && <p className="autor-editorial">{producto.autor}</p>}
            <p className="precio-editorial">{producto.precio} €</p>
          </div>
  
          {/* DESCRIPCIÓN */}
          <p className="descripcion-editorial">{producto.descripcion}</p>
  
          {/* BOTONES EN UNA FILA (PRINCIPAL IZQUIERDA + ICONOS DERECHA) */}
          <div className="editorial-botones-fila">
  
            {/* BOTÓN PRINCIPAL A LA IZQUIERDA */}
            <button className="btn-cesta-editorial">Añadir a la cesta</button>
  
            {/* ICONOS A LA DERECHA */}
            <div className="botones-iconos">
              <button className="btn-icono">
                <img src="/corazon.jpg" alt="Guardar" />
              </button>
  
              <button className="btn-icono">
                <img src="/compartir.jpg" alt="Compartir" />
              </button>
            </div>
  
          </div>
  
        </div>
      </div>
  
      {/* ============================
          SEGUNDA FILA
      ============================ */}
      <div className="fila-inferior">
  
        {/* COLUMNA IZQUIERDA */}
        <div className="col-inferior-izq">
  
          <h2 className="titulo-seccion">Resumen</h2>
  
          <p className="texto-resumen">
            {expandido ? producto.resumen : resumenCorto}
          </p>
  
          {producto.resumen && producto.resumen.length > 250 && (
            <button
              className="btn-leer-mas"
              onClick={() => setExpandido(!expandido)}
            >
              {expandido ? "Leer menos" : "Leer más"}
            </button>
          )}
  
          {/* AUTOR */}
          <div className="autor-box">
            <img
              src=""
              alt="Autor"
              className="autor-foto"
            />
  
            <div className="autor-info">
              <p className="autor-nombre">{producto.autor || "Autor desconocido"}</p>
              <a className="autor-link">Ver más información</a>
            </div>
          </div>
  
        </div>
  
        {/* COLUMNA DERECHA */}
        <div className="col-inferior-der">
  
          <h2 className="titulo-seccion">Detalles</h2>
  
          <div className="detalles-grid">
  
            <p><strong>Editorial:</strong> {producto.editorial}</p>
            <p><strong>Idioma:</strong> {producto.idioma}</p>
            <p><strong>ISBN:</strong> {producto.isbn}</p>
            <p><strong>Fecha publicación:</strong> {producto.fechaPublicacion}</p>
            <p><strong>Género:</strong> {producto.genero}</p>
  
          </div>
  
        </div>
  
      </div>
  
    </div>
  );  
}