import { useParams } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import "./ProductoDetalle.css";

export default function ProductoDetalle() {
  const { id } = useParams();
  const [producto, setProducto] = useState(null);
  const [cantidad, setCantidad] = useState(1);
  const [relacionados, setRelacionados] = useState([]);
  const scrollRef = useRef(null);

  useEffect(() => {
    // Cargar el producto principal
    fetch(`http://localhost:9001/productos/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setProducto({
          id: data.idProducto,
          nombre: data.nombreProducto,
          descripcion: data.descripcion,
          precio: data.precio,
          tipo: data.tipo,
  
          autor: data.autor || null,
          isbn: data.isbn || null,
          numeroPaginas: data.numeroPaginas || null,
          idioma: data.idioma || null,
          resumen: data.resumen || null,
  
          marca: data.marca || null,
          categoria: data.categoria || null,
  
          imagen: data.imagen || "/lector1.jpg",
          miniaturas: [
            data.imagen || "/lector1.jpg",
            "/lector2.jpg",
            "/lector3.jpg"
          ]
        });
  
        // Cargar productos relacionados
        let url = "";
  
        if (data.tipo === "LIBRO") {
          url = "http://localhost:9001/libros/todos";
        } else if (data.tipo === "PAPELERIA") {
          url = "http://localhost:9001/papelerias/todos";
        }
  
        fetch(url)
          .then(res => res.json())
          .then(lista => {
            const filtrados = lista
              .filter(p => p.idProducto !== data.idProducto)
              .slice(0, 12);
  
            setRelacionados(filtrados);
          });
      })
      .catch((error) => console.error("Error cargando producto:", error));
  }, [id]);  

  if (!producto) return <p>Cargando...</p>;

  return (
    <div className="detalle-producto">
  
      {/* COLUMNA IZQUIERDA */}
      <div className="col-izquierda">
        <img 
          src={producto.imagen} 
          className="detalle-imagen" 
          alt={producto.nombre} 
        />
  
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
  
        {producto.autor && (
          <p className="detalle-autor">{producto.autor}</p>
        )}
  
        <p className="detalle-descripcion">{producto.descripcion}</p>
  
        {producto.resumen && (
          <>
            <h3>Resumen</h3>
            <p className="detalle-resumen">{producto.resumen}</p>
          </>
        )}
  
        <hr />
  
        <div className="detalle-extra">
          {producto.tipo === "LIBRO" && (
            <>
              <h3>Ficha técnica</h3>
              <p><strong>ISBN:</strong> {producto.isbn}</p>
              <p><strong>Longitud de impresión:</strong> {producto.numeroPaginas}</p>
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
  
      {/* COLUMNA DERECHA */}
      <div className="col-derecha">
        <div className="card-compra">

          <p className="precio-card">{producto.precio} €</p>

          <hr />

          <p className="disponible">Disponible en 2 días</p>
          <p className="disponible">Disponible en todos los puntos de venta</p>

          {/* CONTROL DE CANTIDAD */}
          <div className="detalle-cantidad card-cantidad">
            <button onClick={() => setCantidad(Math.max(1, cantidad - 1))}>−</button>
            <span>{cantidad}</span>
            <button onClick={() => setCantidad(cantidad + 1)}>+</button>
          </div>


          <button className="btn-cesta">Añadir a la cesta</button>
          <button className="btn-carrito">Añadir al carrito</button>
          <button className="btn-favoritos">Añadir a favoritos</button>

        </div>
      </div>

      {/* PRODUCTOS RELACIONADOS */}
      <div className="relacionados-container">
        <h2>Productos relacionados</h2>

        <div className="relacionados-wrapper">

          {/* Botón izquierda */}
          <button 
            className="scroll-btn left"
            onClick={() => scrollRef.current.scrollBy({ left: -300, behavior: "smooth" })}
          >
            ‹
          </button>

          {/* Carrusel */}
          <div className="relacionados-scroll" ref={scrollRef}>
            {relacionados.map((prod) => (
              <div 
                key={prod.idProducto} 
                className="relacionado-card"
                onClick={() => window.location.href = `/producto/${prod.idProducto}`}
              >
                <img src={prod.imagen || "/lector1.jpg"} alt={prod.nombreProducto} />
                <p className="relacionado-nombre">{prod.nombreProducto}</p>
                <p className="relacionado-precio">{prod.precio} €</p>
              </div>
            ))}
          </div>

          {/* Botón derecha */}
          <button 
            className="scroll-btn right"
            onClick={() => scrollRef.current.scrollBy({ left: 300, behavior: "smooth" })}
          >
            ›
          </button>

        </div>
      </div>

    </div>
  );
  
}
