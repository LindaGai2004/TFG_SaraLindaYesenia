import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import "./ProductoDetalle.css";
import { imagenesLibros, imagenesPapeleria } from "../data/imagenes";
import { useAuth } from "../context/AuthContext";

export default function ProductoDetalle() {
  const { id } = useParams();
  const [producto, setProducto] = useState(null);
  const [expandido, setExpandido] = useState(false);

  const { user } = useAuth();
  const [esFavorito, setEsFavorito] = useState(false);

  // estado para la notificación
  const [mensaje, setMensaje] = useState("");

  // Cargar producto
  useEffect(() => {
    fetch(`http://localhost:9001/productos/${id}`)
      .then(res => res.json())
      .then(data => {

        let imagen = "";
        let miniaturas = [];

        if (data.tipo_producto === "LIBRO") {
          imagen = imagenesLibros[id]?.portada;
          miniaturas = imagenesLibros[id]?.miniaturas || [];
        }

        if (data.tipo_producto === "PAPELERIA") {
          imagen = imagenesPapeleria[id];
          miniaturas = [imagenesPapeleria[id]];
        }

        const base = {
          id: data.idProducto,
          nombre: data.nombreProducto,
          descripcion: data.descripcion,
          precio: data.precio,
          tipo: data.tipo_producto || data.tipo,
          imagen: imagen,
          miniaturas: miniaturas,
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

        // Si es libro → cargar detalles
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

        // Si es papelería → cargar detalles
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

  // Cargar si este producto ya es favorito
  useEffect(() => {
    if (!producto) return;

    const fetchFavorito = async () => {
      try {
        const res = await fetch(`http://localhost:9001/usuarios/favoritos`, {
  credentials: "include"
});
        const data = await res.json();

        const encontrado = data.some(f => f.idProducto === producto.id);
        setEsFavorito(encontrado);

      } catch (error) {
        console.error("Error comprobando favorito:", error);
      }
    };

    fetchFavorito();
  }, [producto, user.idUsuario]);

  // Añadir / eliminar favorito
  const toggleFavorito = async () => {
    try {
      if (esFavorito) {
        await fetch(`http://localhost:9001/usuarios/favoritos/${producto.id}`, {
          method: "DELETE",
          credentials: "include"
        });

        setMensaje("Eliminado de favoritos");

      } else {
        await fetch(`http://localhost:9001/usuarios/favoritos/${producto.id}`, {
          method: "POST",
          credentials: "include"
        });

        setMensaje("Añadido a favoritos");
      }

      // Ocultar mensaje después de 2 segundos
      setTimeout(() => setMensaje(""), 2000);

      setEsFavorito(!esFavorito);

    } catch (error) {
      console.error("Error al actualizar favorito:", error);
    }
  };

  if (!producto) return <p>Cargando...</p>;

  const resumenCorto =
    producto.resumen && producto.resumen.length > 250
      ? producto.resumen.slice(0, 250) + "..."
      : producto.resumen;

  return (
    <div className="detalle-producto">

      {mensaje && <div className="notificacion-toast">{mensaje}</div>}

      {/* FILA 1 */}
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

          {/* BOTONES */}
          <div className="editorial-botones-fila">

            {/* BOTÓN PRINCIPAL */}
            <button className="btn-cesta-editorial">Añadir a la cesta</button>

            {/* ICONOS */}
            <div className="botones-iconos">

              {/* BOTÓN FAVORITO */}
              <button className="btn-icono" onClick={toggleFavorito}>
                <img
                  src={esFavorito ? "/corazon-lleno.png" : "/corazon.jpg"}
                  alt="Favorito"
                />
              </button>

              <button className="btn-icono">
                <img src="/compartir.jpg" alt="Compartir" />
              </button>

            </div>

          </div>

        </div>
      </div>

      {/* FILA 2 */}
      <div className="fila-inferior">

        {/* IZQUIERDA */}
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

          <div className="autor-box">
            <img src="" alt="Autor" className="autor-foto" />

            <div className="autor-info">
              <p className="autor-nombre">{producto.autor || "Autor desconocido"}</p>
              <a className="autor-link">Ver más información</a>
            </div>
          </div>

        </div>

        {/* DERECHA */}
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