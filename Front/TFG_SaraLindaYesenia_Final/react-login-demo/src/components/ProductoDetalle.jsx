import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import "./ProductoDetalle.css";
import { useAuth } from "../context/AuthContext";
import ProductoImagenes from "../components/ProductoImagenes";

export default function ProductoDetalle() {
  const { id } = useParams();
  const [producto, setProducto] = useState(null);
  const [expandido, setExpandido] = useState(false);

  const { user } = useAuth();
  const [esFavorito, setEsFavorito] = useState(false);

  const [mensaje, setMensaje] = useState("");

  // Cargar producto base
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
          imagenes: data.imagenes || [],
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

  // Cargar si es favorito
  useEffect(() => {
    if (!producto) return;
    if (!user) return;

    const fetchFavorito = async () => {
      try {
        const res = await fetch(`http://localhost:9001/usuarios/favoritos`, {
          credentials: "include"
        });

        if (res.status === 401) {
          setEsFavorito(false);
          return;
        }

        const data = await res.json();
        const encontrado = data.some(f => f.idProducto === producto.id);
        setEsFavorito(encontrado);

      } catch (error) {
        console.error("Error comprobando favorito:", error);
      }
    };

    fetchFavorito();
  }, [producto, user]);

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
    <div className="detalle-producto fondo-detalle">

      {mensaje && <div className="notificacion-toast">{mensaje}</div>}

      {/* FILA 1 */}
      <div className="fila-superior dos-columnas">

        <div className="col-izquierda">
          <ProductoImagenes imagenes={producto.imagenes} />
        </div>

        <div className="col-derecha-editorial">

          <div className="editorial-header">
            <h1 className="titulo-editorial">{producto.nombre}</h1>
            {producto.autor && <p className="autor-editorial">{producto.autor}</p>}
            <p className="precio-editorial">{producto.precio} €</p>
          </div>

          <p className="descripcion-editorial">{producto.descripcion}</p>

          <div className="editorial-botones-fila">

            <button className="btn-cesta-editorial">Añadir a la cesta</button>

            <div className="botones-iconos">
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