import { useParams, useNavigate } from "react-router-dom"; import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import ProductoImagenes from "./ProductoImagenes";
import { apiGet, apiPost, apiDelete, getUploadUrl  } from "../../api/api";
import { crearItemHistorial, guardarEnHistorial } from "../../utils/historialProductos";
import "./ProductoDetalle.css";

export default function ProductoDetalle() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [producto, setProducto] = useState(null);
  const [expandido, setExpandido] = useState(false); // LIBRO
  const [expandidoPap, setExpandidoPap] = useState(false); // PAPELERÍA
  const [relacionados, setRelacionados] = useState([]);

  const { user } = useAuth();
  const { addToCart } = useCart();

  const [esFavorito, setEsFavorito] = useState(false);
  const [mensaje, setMensaje] = useState("");

  const [mostrarAvisoFavorito, setMostrarAvisoFavorito] = useState(false);
  const [mostrarAvisoCarrito, setMostrarAvisoCarrito] = useState(false);

  // Cargar producto base
  // ahora con ruta de api.js
  useEffect(() => {
    apiGet(`/productos/${id}`)
      .then(data => {
        guardarEnHistorial(crearItemHistorial(data));
        const base = {
          id: data.idProducto,
          nombre: data.nombreProducto,
          descripcion: data.descripcion,
          precio: data.precio,
          tipo: data.tipo_producto || data.tipo,
          imagenes: data.imagenes || [],
          autor: null, isbn: null, numeroPaginas: null,
          idioma: null, resumen: null, editorial: null,
          fechaPublicacion: null, genero: null, marca: null,
          categoria: null, descripcionLarga: null
        };
        setProducto(base);

        if (base.tipo === "LIBRO") {
          apiGet(`/libros/${id}`).then(libro => {
            setProducto(prev => ({
              ...prev,
              autor: libro.autor, isbn: libro.isbn,
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
          apiGet(`/papelerias/${id}`).then(pap => {
            setProducto(prev => ({
              ...prev,
              marca: pap.marca?.nombreMarca,
              categoria: pap.categoria?.nombreCategoria,
              descripcionLarga: pap.descripcionLarga || null
            }));
          });
        }
      });
  }, [id]);

  // Cargar productos relacionados
  // ahora con ruta de api.js
  useEffect(() => {
    if (!producto) return;

    let url = "";
    if (producto.tipo === "LIBRO") {
      url = `/productos/relacionados/libro?autor=${producto.autor}&genero=${producto.genero}&idActual=${producto.id}`;
    } else if (producto.tipo === "PAPELERIA") {
      url = `/productos/relacionados/papeleria?marca=${producto.marca}&categoria=${producto.categoria}&idActual=${producto.id}`;
    }

    apiGet(url)
      .then(data => setRelacionados(data))
      .catch(err => console.error("Error cargando relacionados:", err));
  }, [producto]);

  // Cargar si es favorito
  useEffect(() => {
    if (!producto || !user) return;

    apiGet(`/usuarios/favoritos`)
      .then(data => {
        const encontrado = data.some(f => f.idProducto === producto.id);
        setEsFavorito(encontrado);
      })
      .catch(() => setEsFavorito(false));
  }, [producto, user]);


  const handleCompartir = () => {
    const shareData = {
      title: producto.nombre,
      text: `¡Mira este producto en Archives!: ${producto.nombre}`,
      url: window.location.href, // La URL actual del detalle del producto
    };

    // Verificamos si el navegador soporta la Web Share API
    if (navigator.share) {
      navigator.share(shareData)
        .then(() => console.log('Compartido con éxito'))
        .catch((error) => console.log('Error al compartir', error));
    } else {
      // Si no lo soporta  copiamos al portapapeles
      navigator.clipboard.writeText(window.location.href);
      setMensaje("Copiado al portapapeles ✨");
      setTimeout(() => setMensaje(""), 2000);
    }
  };


  const toggleFavorito = async () => {
    if (!user) {
      setMostrarAvisoFavorito(true);
      return;
    }

    try {
      if (esFavorito) {
        await apiDelete(`/usuarios/favoritos/${producto.id}`);
        setMensaje("Eliminado de favoritos");
      } else {
        await apiPost(`/usuarios/favoritos/${producto.id}`);
        setMensaje("Añadido a favoritos");
      }

      setEsFavorito(!esFavorito);
      setTimeout(() => setMensaje(""), 2000);

    } catch (error) {
      console.error("Error al actualizar favorito:", error);
    }
  };

  if (!producto) return <p>Cargando...</p>;

  // Resumen libro
  const resumenCorto =
    producto.resumen && producto.resumen.length > 250
      ? producto.resumen.slice(0, 250) + "..."
      : producto.resumen;

  // Lista papelería
  const frasesPapeleria = producto.descripcionLarga
    ? producto.descripcionLarga.split(".").map(f => f.trim()).filter(f => f !== "")
    : [];

  return (
    <>
      {mostrarAvisoFavorito && (
        <div className="notificacion-login">
          <p>Debes iniciar sesión para guardar favoritos.</p>
          <div className="notificacion-botones">
            {/* Cambiado: usar navigate para no perder el state */}
            <button className="btn-login-aviso"
              onClick={() => navigate('/login', { state: { from: window.location.pathname } })}>
              Ir al login
            </button>
            <button className="btn-cerrar-aviso" onClick={() => setMostrarAvisoFavorito(false)}>
              Cerrar
            </button>
          </div>
        </div>
      )}

      {mostrarAvisoCarrito && (
        <div className="notificacion-login">
          <p>Debes iniciar sesión para añadir productos al carrito.</p>
          <div className="notificacion-botones">
            {/* Cambiado: usar navigate para no perder el state */}
            <button className="btn-login-aviso"
              onClick={() => navigate('/login', { state: { from: window.location.pathname } })}>
              Ir al login
            </button>
            <button className="btn-cerrar-aviso" onClick={() => setMostrarAvisoCarrito(false)}>
              Cerrar
            </button>
          </div>
        </div>
      )}

      {mensaje && <div className="notificacion-toast">{mensaje}</div>}

      <div className="fondo-detalle">

        <div className="detalle-layout">

          {/* COLUMNA IZQUIERDA */}
          <div className="detalle-contenido">

            {/* FILA 1 */}
            <div className="fila-superior dos-columnas">
              <div className="col-izquierda">
                <ProductoImagenes imagenes={producto.imagenes} />
              </div>

              <div className="col-derecha-editorial">
                <h1 className="titulo-editorial">{producto.nombre}</h1>
                {producto.autor && <p className="autor-editorial">{producto.autor}</p>}
                <p className="precio-editorial">{producto.precio} €</p>

                <p className="descripcion-editorial">{producto.descripcion}</p>

                <div className="editorial-botones-fila">
                  <button
                    className="btn-cesta-editorial"
                    onClick={() => {
                      if (!user) {
                        setMostrarAvisoCarrito(true);
                        return; // evita añadir al carrito sin haberte logueado 
                      }

                      addToCart(producto.id, 1);
                      setMensaje("Producto añadido al carrito");
                      setTimeout(() => setMensaje(""), 2000);
                    }}
                  >
                    Añadir al carrito
                  </button>

                  <div className="botones-iconos">
                    <button className="btn-icono" onClick={toggleFavorito}>
                      <img
                        src={esFavorito ? "/corazon-lleno.png" : "/corazon.jpg"}
                        alt="Favorito"
                      />
                    </button>

                    <button className="btn-icono" onClick={handleCompartir}>
                      <img src="/compartir.jpg" alt="Compartir" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* FILA 2 */}
            <div className="fila-inferior">
              <div className="col-inferior-izq">

                {/* TÍTULO CAMBIANTE */}
                <h2 className="titulo-seccion">
                  {producto.tipo === "LIBRO" ? "Resumen" : "Acerca de este producto"}
                </h2>

                {/* LIBRO */}
                {producto.tipo === "LIBRO" && (
                  <>
                    <p className="texto-resumen">
                      {expandido ? producto.resumen : resumenCorto}
                    </p>

                    {producto.resumen && producto.resumen.length > 250 && (
                      <button className="btn-leer-mas" onClick={() => setExpandido(!expandido)}>
                        {expandido ? "Leer menos" : "Leer más"}
                      </button>
                    )}
                  </>
                )}

                {/* PAPELERÍA */}
                {producto.tipo === "PAPELERIA" && (
                  <>
                    <ul className="lista-detalles">
                      {(expandidoPap ? frasesPapeleria : frasesPapeleria.slice(0, 3)).map((frase, index) => (
                        <li key={index}>{frase}</li>
                      ))}
                    </ul>

                    {frasesPapeleria.length > 3 && (
                      <button className="btn-leer-mas" onClick={() => setExpandidoPap(!expandidoPap)}>
                        {expandidoPap ? "Leer menos" : "Leer más"}
                      </button>
                    )}
                  </>
                )}
              </div>

              <div className="col-inferior-der">
                <h2 className="titulo-seccion">Detalles</h2>

                <div className="detalles-grid">

                  {/* DETALLES LIBRO */}
                  {producto.tipo === "LIBRO" && (
                    <>
                      <p><strong>Editorial:</strong> {producto.editorial}</p>
                      <p><strong>Idioma:</strong> {producto.idioma}</p>
                      <p><strong>ISBN:</strong> {producto.isbn}</p>
                      <p><strong>Fecha publicación:</strong> {producto.fechaPublicacion}</p>
                      <p><strong>Género:</strong> {producto.genero}</p>
                    </>
                  )}

                  {/* DETALLES PAPELERÍA */}
                  {producto.tipo === "PAPELERIA" && (
                    <>
                      <p><strong>Marca:</strong> {producto.marca}</p>
                      <p><strong>Categoría:</strong> {producto.categoria}</p>
                    </>
                  )}

                </div>
              </div>
            </div>
          </div>

          {/* COLUMNA DERECHA: RELACIONADOS */}
          <div className="detalle-relacionados">
            <h3>Productos relacionados</h3>

            <div className="relacionados-lista">
              {relacionados.length === 0 && <p>No hay productos relacionados</p>}

              {relacionados.map(r => {
                const imgPrincipal = r.imagenes?.find(img => img.tipo === "PRINCIPAL")?.ruta;

                return (
                  <div
                    key={r.idProducto}
                    className="relacionado-item"
                    // Cambiado: usar navigate en lugar de window.location.href
                    onClick={() => navigate(`/producto/${r.idProducto}`)}
                  >
                    <img src={getUploadUrl(imgPrincipal)} alt={r.nombreProducto} />

                    <p className="relacionado-nombre">{r.nombreProducto}</p>
                    <p className="relacionado-precio">{r.precio} €</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
