import { useParams, useNavigate } from "react-router-dom"; 
import { useEffect, useState } from "react";
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

  // 'descripcion', 'detalles' o 'resenas'
  const [tabActiva, setTabActiva] = useState("descripcion");

  // Estados para reseñas
  const [resenas, setResenas] = useState([]);
  const [media, setMedia] = useState(0);
  const [nuevaCalificacion, setNuevaCalificacion] = useState(5);
  const [nuevoComentario, setNuevoComentario] = useState("");
  const [yaResenado, setYaResenado] = useState(false);
  
  const handleEliminarResena = async (idResena) => {
    if (!window.confirm("¿Estás seguro de que quieres borrar tu reseña?")) return;

    try {
      // Usamos el idResena para la ruta del delete
      await apiDelete(`/resenas/eliminar/${idResena}`);
      
      // Actualizamos el estado local para que desaparezca de la lista
      setResenas(resenas.filter(r => r.idResena !== idResena));
      
      // Permitimos que el usuario pueda volver a escribir una reseña
      setYaResenado(false);
      
      setMensaje("Reseña eliminada");
      setTimeout(() => setMensaje(""), 2000);

      // Recargar la media para que se actualice sin la reseña borrada
      const resMedia = await fetch(`http://localhost:9001/resenas/media/${id}`);
      const nuevaMedia = await resMedia.json();
      setMedia(nuevaMedia);
    } catch (error) {
      console.error("Error al eliminar la reseña:", error);
      setMensaje("No se pudo eliminar la reseña");
    }
  };


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
  useEffect(() => {
    if (!producto) return;

    let url = "";

    {/*if (producto.tipo === "LIBRO") {
      url = `http://localhost:9001/productos/relacionados/libro?autor=${producto.autor}&genero=${producto.genero}&idActual=${producto.id}`;
    } else if (producto.tipo === "PAPELERIA") {
      url = `http://localhost:9001/productos/relacionados/papeleria?marca=${producto.marca}&categoria=${producto.categoria}&idActual=${producto.id}`;
    }

    fetch(url)
      .then(res => res.json())*/}
      
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


  // Cargar reseñas y media ---------------------------------------------------------
  useEffect(() => {
    if (!id) return;
    
    // Obtener lista de reseñas
    fetch(`http://localhost:9001/resenas/producto/${id}`)
      .then(res => res.json())
      .then(data => setResenas(data));

    // Obtener nota media
    fetch(`http://localhost:9001/resenas/media/${id}`)
      .then(res => res.json())
      .then(data => setMedia(data));
  }, [id]);

  // Verificar si el usuario ya hizo una reseña (para ocultar el formulario)
  useEffect(() => {
    if (user && id) {
      // Podrías crear un endpoint específico o filtrar en el array de reseñas
      const check = resenas.some(r => r.usuario.idUsuario === user.idUsuario);
      setYaResenado(check);
    }
  }, [resenas, user, id]);

  const handleEnviarResena = async (e) => {
    e.preventDefault();
    if (!user) {
      setMostrarAvisoCarrito(true);
      return;
    }

    const resenaDTO = {
      idUsuario: user.idUsuario,
      idProducto: parseInt(id),
      calificacion: nuevaCalificacion,
      comentario: nuevoComentario
    };

    try {
      const data = await apiPost("/resenas/guardar", resenaDTO);
      setResenas([data, ...resenas]); // Añadir la nueva al principio
      setNuevoComentario("");
      setYaResenado(true);
      setMensaje("¡Gracias por tu reseña! ✨");
      setTimeout(() => setMensaje(""), 2000);
      
      // Recargar la media
      const resMedia = await fetch(`http://localhost:9001/resenas/media/${id}`);
      const nuevaMedia = await resMedia.json();
      setMedia(nuevaMedia);
    } catch (error) {
      console.error("Error al guardar reseña", error);
    }
  };


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

                <div className="rating-superior">
                  <span className="estrellas-rating">
                    {"★".repeat(Math.round(media)) + "☆".repeat(5 - Math.round(media))}
                  </span>
                  <span className="numero-media-texto">{media.toFixed(1)}</span>
                  {/* total valoraciones */}
                  <a 
                    href="#seccion-resenas" className="total-valoraciones-link"
                    onClick={(e) => {
                      e.preventDefault(); // Evita el salto brusco
                      setTabActiva("resenas"); // Activa la pestaña de reseñas
                      setTimeout(() => {
                        document.getElementById('seccion-resenas')?.scrollIntoView({ behavior: 'smooth' });
                      }, 100);
                    }}
                  >
                    ({resenas.length} valoraciones)
                  </a>
                </div>

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
                        src={esFavorito ? "/corazon_lleno.png" : "/corazon_vacio.png"}
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
            {/* SECCIÓN DE PESTAÑAS (TABS) */}
            <div className="contenedor-pestañas">
              <div className="cabecera-pestañas">
                <button 
                  className={`tab-btn ${tabActiva === "descripcion" ? "active" : ""}`}
                  onClick={() => setTabActiva("descripcion")}
                >
                  {producto.tipo === "LIBRO" ? "Resumen" : "Acerca del producto"}
                </button>
                <button 
                  className={`tab-btn ${tabActiva === "detalles" ? "active" : ""}`}
                  onClick={() => setTabActiva("detalles")}
                >
                  Detalles
                </button>
                <button 
                  className={`tab-btn ${tabActiva === "resenas" ? "active" : ""}`}
                  onClick={() => setTabActiva("resenas")}
                  id="seccion-resenas"
                >
                  Reseñas ({resenas.length})
                </button>
              </div>

              <div className="contenido-pestaña">
                
                {/* PESTAÑA 1: DESCRIPCIÓN / RESUMEN */}
                {tabActiva === "descripcion" && (
                  <div className="tab-panel animar-entrada">
                    {producto.tipo === "LIBRO" ? (
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
                    ) : (
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
                )}

                {/* PESTAÑA 2: DETALLES TÉCNICOS */}
                {tabActiva === "detalles" && (
                  <div className="tab-panel animar-entrada">
                    <div className="detalles-grid">
                      {producto.tipo === "LIBRO" ? (
                        <>
                          <p><strong>Editorial:</strong> {producto.editorial}</p>
                          <p><strong>Idioma:</strong> {producto.idioma}</p>
                          <p><strong>ISBN:</strong> {producto.isbn}</p>
                          <p><strong>Fecha publicación:</strong> {producto.fechaPublicacion}</p>
                          <p><strong>Género:</strong> {producto.genero}</p>
                          <p><strong>Páginas:</strong> {producto.numeroPaginas}</p>
                        </>
                      ) : (
                        <>
                          <p><strong>Marca:</strong> {producto.marca}</p>
                          <p><strong>Categoría:</strong> {producto.categoria}</p>
                        </>
                      )}
                    </div>
                  </div>
                )}

                {/* PESTAÑA 3: RESEÑAS */}
                {tabActiva === "resenas" && (
                  <div className="tab-panel animar-entrada">
                    <div className="resenas-header">
                      <div className="media-estrellas">
                        <span className="numero-media">{media.toFixed(1)}</span>
                        <div className="estrellas-puntos">
                          {"★".repeat(Math.round(media)) + "☆".repeat(5 - Math.round(media))}
                        </div>
                        <p>{resenas.length} valoraciones</p>
                      </div>

                      {user && !yaResenado ? (
                        <form className="form-resena" onSubmit={handleEnviarResena}>
                          <h3>Escribe tu opinión</h3>
                          <div className="selector-estrellas">
                            {[1, 2, 3, 4, 5].map(num => (
                              <span 
                                key={num} 
                                className={`star ${nuevaCalificacion >= num ? 'filled' : ''}`}
                                onClick={() => setNuevaCalificacion(num)}
                              >★</span>
                            ))}
                          </div>
                          <textarea 
                            placeholder="¿Qué te ha parecido este producto?"
                            value={nuevoComentario}
                            onChange={(e) => setNuevoComentario(e.target.value)}
                            required
                          />
                          <button type="submit" className="btn-enviar-resena">Publicar reseña</button>
                        </form>
                      ) : user && yaResenado ? (
                        <p className="aviso-resena">Ya has valorado este producto. ¡Gracias!</p>
                      ) : (
                        <p className="aviso-resena">Inicia sesión para dejar una reseña.</p>
                      )}
                    </div>

                    <div className="lista-resenas-items">
                      {resenas.length === 0 ? (
                        <p>Aún no hay reseñas. ¡Sé el primero en opinar!</p>
                      ) : (
                        resenas.map(r => (
                          <div key={r.idResena} className="resena-card">
                            <div className="resena-usuario">
                              <img src={r.usuario.avatar || "/avatar-default.png"} alt="User" />
                              <div>
                                <p className="nombre-u">{r.usuario.username}</p>
                                <div className="estrellas-r">
                                  {"★".repeat(r.calificacion) + "☆".repeat(5 - r.calificacion)}
                                </div>
                              </div>
                              <span className="fecha-r">{new Date(r.fecha).toLocaleDateString()}</span>
                              
                              {user && user.idUsuario === r.usuario.idUsuario && (
                                <button 
                                  className="btn-eliminar-resena"
                                  onClick={() => handleEliminarResena(r.idResena)}
                                >🗑️</button>
                              )}
                            </div>
                            <p className="texto-r">{r.comentario}</p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
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
