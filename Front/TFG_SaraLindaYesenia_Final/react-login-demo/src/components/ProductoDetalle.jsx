import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import "./ProductoDetalle.css";

export default function ProductoDetalle() {
  const { id } = useParams();
  const [producto, setProducto] = useState(null);
  const [cantidad, setCantidad] = useState(1);

  useEffect(() => {
    fetch(`http://localhost:9001/productos/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setProducto({
          id: data.idProducto,
          nombre: data.nombreProducto,
          descripcion: data.descripcion,
          precio: data.precio,
          tipo: data.tipo,

          // LIBRO
          autor: data.autor || null,
          isbn: data.isbn || null,
          numeroPaginas: data.numeroPaginas || null,
          idioma: data.idioma || null,
          resumen: data.resumen || null,

          // PAPELERÍA
          marca: data.marca || null,
          categoria: data.categoria || null,

          imagen: data.imagen || "/lector1.jpg",
          miniaturas: [
            data.imagen || "/lector1.jpg",
            "/lector2.jpg",
            "/lector3.jpg"
          ]
        });
      })
      .catch((error) => console.error("Error cargando producto:", error));
  }, [id]);

  if (!producto) return <p>Cargando...</p>;

  return (
    <div className="detalle-producto">

      {/* COLUMNA IZQUIERDA */}
      <div className="detalle-columna-izquierda">
        <img 
          src={producto.imagen} 
          className="detalle-imagen" 
          alt={producto.nombre} 
        />

        {/* MINIATURAS */}
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
      <div className="detalle-info">
        <h2>{producto.nombre}</h2>

        {producto.autor && (
          <p className="detalle-autor">{producto.autor}</p>
        )}

        <p className="detalle-precio">{producto.precio} €</p>

        {/* CONTROL DE CANTIDAD */}
        <div className="detalle-cantidad">
          <button onClick={() => setCantidad(Math.max(1, cantidad - 1))}>−</button>
          <span>{cantidad}</span>
          <button onClick={() => setCantidad(cantidad + 1)}>+</button>
        </div>

        {/* BOTONES */}
        <div className="detalle-botones">
          <button className="carrito">Añadir al carrito</button>
          <button className="comprar">Comprar ahora</button>
        </div>

        {/* DESCRIPCIÓN */}
        <p className="detalle-descripcion">{producto.descripcion}</p>

        {/* RESUMEN SOLO SI ES LIBRO */}
        {producto.tipo === "LIBRO" && producto.resumen && (
          <p className="detalle-resumen">
            <strong>Resumen:</strong> {producto.resumen}
          </p>
        )}

        {/* DETALLES SEGÚN TIPO */}
        <div className="detalle-extra">
          {producto.tipo === "LIBRO" && (
            <>
              <h3>Detalles del libro</h3>
              <p><strong>ISBN:</strong> {producto.isbn}</p>
              <p><strong>Número de páginas:</strong> {producto.numeroPaginas}</p>
              <p><strong>Idioma:</strong> {producto.idioma}</p>
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

    </div>
  );
}
