import './Home.css';
import { useState, useRef, useEffect, } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ChevronLeft, ChevronRight} from 'lucide-react';
import { apiGet, apiPost } from '../api/api';

const LIBRO_MES_STORAGE_KEY = 'libro_mes_id';

// Componente estar en pantalla
function useOnScreen(ref) {
  const [isIntersecting, setIntersecting] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIntersecting(entry.isIntersecting),
      { threshold: 0.3 } // empieza cuando el 30% del bloque es visible
    );

    if (ref.current) observer.observe(ref.current);

    return () => {
      if (ref.current) observer.unobserve(ref.current);
    };
  }, [ref]);

  return isIntersecting;
}

// Componente contador
function Contador({ final, visible }) {
  const [valor, setValor] = useState(0);

  useEffect(() => {
    if (!visible) return; // no empieza hasta que sea visible

    let inicio = 0;
    const velocidad = 30; // ms entre incrementos
    const incremento = final / 100;

    const intervalo = setInterval(() => {
      inicio += incremento;
      if (inicio >= final) {
        clearInterval(intervalo);
        setValor(final);
      } else {
        setValor(Math.floor(inicio));
      }
    }, velocidad);

    return () => clearInterval(intervalo);
  }, [final, visible]);

  return <p className="numero-logro">{valor}</p>;
}


export default function Home() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [mostrarAvisoCarrito, setMostrarAvisoCarrito] = useState(false);
  const [mensaje, setMensaje] = useState("");


  // Generos
  useEffect(() => {
    // función del carrusel de géneros
    const track = document.getElementById("track");
    if (!track) return;
    const wrap = track.parentElement;
    const cards = Array.from(track.children);
    const prev = document.getElementById("prev");
    const next = document.getElementById("next");

    const isMobile = () => matchMedia("(max-width:767px)").matches;

    let current = 0;

    function center(i) {
      const card = cards[i];
      const axis = isMobile() ? "top" : "left";
      const size = isMobile() ? "clientHeight" : "clientWidth";
      const start = isMobile() ? card.offsetTop : card.offsetLeft;
      wrap.scrollTo({
        [axis]: start - (wrap[size] / 2 - card[size] / 2),
        behavior: "smooth"
      });
    }

    function toggleUI(i) {
      cards.forEach((c, k) => c.toggleAttribute("data-active", k === i));
      prev.disabled = i === 0;
      next.disabled = i === cards.length - 1;
    }

    function activate(i, scroll) {
      if (i === current) return;
      current = i;
      toggleUI(i);
      if (scroll) center(i);
    }

    function go(step) {
      activate(Math.min(Math.max(current + step, 0), cards.length - 1), true);
    }

    prev.onclick = () => go(-1);
    next.onclick = () => go(1);

    addEventListener("keydown", (e) => {
      if (["ArrowRight", "ArrowDown"].includes(e.key)) go(1);
      if (["ArrowLeft", "ArrowUp"].includes(e.key)) go(-1);
    });

    cards.forEach((card, i) => {
      card.addEventListener("mouseenter", () => matchMedia("(hover:hover)").matches && activate(i, true));
      card.addEventListener("click", () => activate(i, true));
    });

    let sx = 0, sy = 0;
    track.addEventListener("touchstart", (e) => {
      sx = e.touches[0].clientX;
      sy = e.touches[0].clientY;
    }, { passive: true });

    track.addEventListener("touchend", (e) => {
      const dx = e.changedTouches[0].clientX - sx;
      const dy = e.changedTouches[0].clientY - sy;
      if (isMobile() ? Math.abs(dy) > 60 : Math.abs(dx) > 60)
        go((isMobile() ? dy : dx) > 0 ? -1 : 1);
    }, { passive: true });

    addEventListener("resize", () => center(current));

    toggleUI(0);
    center(0);
  }, []);

  //Scroll
  const carruselResenasRef = useRef(null);
  const carruselLectorRef = useRef(null);
  const scrollLectorIzquierda = () => {
    carruselLectorRef.current.scrollBy({ left: -300, behavior: 'smooth' });
  };
  const scrollLectorDerecha = () => {
    carruselLectorRef.current.scrollBy({ left: 300, behavior: 'smooth' });
  };

  const scrollResenasIzquierda = () => {
    carruselResenasRef.current.scrollBy({ left: -400, behavior: 'smooth' });
  };
  const scrollResenasDerecha = () => {
    carruselResenasRef.current.scrollBy({ left: 400, behavior: 'smooth' });
  };

  {/*Botón de incrementar*/ }
  const [cantidad, setCantidad] = useState(1);
  async function handleAddToCart(item) {
    if (!user) {
      alert("Debes iniciar sesión");
      return;
    }
    try {
      await apiPost("/carrito/add", item);
      alert("Producto añadido");
    } catch (e) {
      console.error(e);
      alert("Error al añadir producto");
    }
  }
  const incrementarCantidad = () => {
    setCantidad(cantidad + 1);
  };

  const decrementarCantidad = () => {
    if (cantidad > 1) {
      setCantidad(cantidad - 1);
    }
  };

  {/*Logros*/ }
  const logrosRef = useRef();
  const visible = useOnScreen(logrosRef);

  // CÓDIGO PARA OCULTAR/MOSTRAR NAVBAR AUTOMÁTICAMENTE
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const scrollTimeout = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Si estás muy arriba, siempre muestra el nav
      if (currentScrollY < 100) {
        setIsVisible(true);
        if (scrollTimeout.current) {
          clearTimeout(scrollTimeout.current);
        }
        setLastScrollY(currentScrollY);
        return;
      }

      // Si estás bajando, oculta el nav
      if (currentScrollY > lastScrollY) {
        setIsVisible(false);

        // Después de 1 segundo sin scrollear, vuelve a mostrar
        if (scrollTimeout.current) {
          clearTimeout(scrollTimeout.current);
        }
        scrollTimeout.current = setTimeout(() => {
          setIsVisible(true);
        }, 1000); // Aparece después de 1 segundo
      }
      // Si subes, muestra el nav inmediatamente
      else if (currentScrollY < lastScrollY) {
        setIsVisible(true);
        if (scrollTimeout.current) {
          clearTimeout(scrollTimeout.current);
        }
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current);
      }
    };
  }, [lastScrollY]);

  const [libroMes, setLibroMes] = useState(null);

  useEffect(() => {
    async function cargarLibroMes() {
      try {
        const libroMesId = localStorage.getItem(LIBRO_MES_STORAGE_KEY) || '31';
        const data = await apiGet(`/productos/${libroMesId}`);
        setLibroMes(data);
      } catch (error) {
        console.error("Error cargando libro del mes:", error);
      }
    }

    cargarLibroMes();
  }, []);

  if (!libroMes) return null;

  return (
    <div className="home-container">
      {mostrarAvisoCarrito && (
        <div className="notificacion-login">
          <p>Debes iniciar sesión para añadir productos al carrito.</p>
          <div className="notificacion-botones">
            <a href="/login" className="btn-login-aviso">Ir al login</a>
            <button 
              className="btn-cerrar-aviso" 
              onClick={() => setMostrarAvisoCarrito(false)}
            >
              Cerrar
            </button>
          </div>
        </div>
      )}

      {mensaje && <div className="notificacion-toast">{mensaje}</div>}

      <div className='home'>
        {/* Bloque de video */}
        <div className="bloque-video">
          <video className="video-fondo" autoPlay muted loop>
            <source src="/home-video-2.mp4" type="video/mp4" />
          </video>

          <div className="contenido-video">
            <h1 className="titulo-video">Tu espacio de lectura y creatividad</h1>
            <p className="subtitulo-video">
              Libros, papelería y todo lo que necesitas para inspirarte.
            </p>

            <a href="/productos" className="btn-hero">
              Ver catálogo
            </a>
          </div>
        </div>


        {/* Sección reseñas */}
        <div className="seccion-resenas">
          <h2 className="titulo-resenas">Lo que dicen nuestros lectores</h2>

          <div className="carrusel-resenas">
            {/* Flecha izquierda */}
            <button className="flecha-resenas izquierda" onClick={scrollResenasIzquierda}>
              <ChevronLeft size={20} />
            </button>

            {/* Carrusel */}
            <div className="contenedor-resenas" ref={carruselResenasRef}>
              {/* Reseña 1 */}
              <div className="bloque-resena">
                <h3 className="titulo-libro-resena">El viaje interior</h3>
                <p className="subtitulo-libro-resena">por Clara Montes</p>
                <div className="estrellas-resena">★★★★★</div>
                <p className="texto-resena">
                  “Este libro fue un cambio total para mí. Desde el primer capítulo, me sentí profundamente enganchado.”
                </p>
                <div className="info-lector-resena">
                  <img src="/resena1.jpg" alt="Claudia Gar" className="imagen-lector-resena" />
                  <div className="datos-lector-resena">
                    <p className="nombre-lector-resena">Claudia Gar</p>
                    <p className="ocupacion-lector-resena">Cliente y Colaborador</p>
                  </div>
                </div>
              </div>

              {/* Reseña 2 */}
              <div className="bloque-resena">
                <h3 className="titulo-libro-resena">Horizontes lejanos</h3>
                <p className="subtitulo-libro-resena">por Miguel Ángel Ruiz</p>
                <div className="estrellas-resena">★★★★</div>
                <p className="texto-resena">
                  “Como fanática de la ciencia ficción, he leído muchos libros, pero este realmente me transportó a otro mundo.”
                </p>
                <div className="info-lector-resena">
                  <img src="/resena2.jpg" alt="Len Brooks" className="imagen-lector-resena" />
                  <div className="datos-lector-resena">
                    <p className="nombre-lector-resena">Len Brooks</p>
                    <p className="ocupacion-lector-resena">Consultora de historias</p>
                  </div>
                </div>
              </div>

              {/* Reseña 3 */}
              <div className="bloque-resena">
                <h3 className="titulo-libro-resena">Ecos del pasado</h3>
                <p className="subtitulo-libro-resena">por Laura Sánchez</p>
                <div className="estrellas-resena">★★★★★</div>
                <p className="texto-resena">
                  “Como amante de la historia, siempre busco ficción bien investigada. Este libro me encantó especialmente.”
                </p>
                <div className="info-lector-resena">
                  <img src="/resena3.jpg" alt="Owen Carter" className="imagen-lector-resena" />
                  <div className="datos-lector-resena">
                    <p className="nombre-lector-resena">Owen Carter</p>
                    <p className="ocupacion-lector-resena">Editor</p>
                  </div>
                </div>
              </div>

              {/* Reseña 4 */}
              <div className="bloque-resena">
                <h3 className="titulo-libro-resena">La caída</h3>
                <p className="subtitulo-libro-resena">por Albert Camus</p>
                <div className="estrellas-resena">★★★★★</div>
                <p className="texto-resena">
                  “Me encantan las historias con personajes profundos, y aquí encontré protagonistas que se sienten reales.”
                </p>
                <div className="info-lector-resena">
                  <img src="/resena4.jpg" alt="Miriam Delish" className="imagen-lector-resena" />
                  <div className="datos-lector-resena">
                    <p className="nombre-lector-resena">Miriam Delish</p>
                    <p className="ocupacion-lector-resena">Colaborador</p>
                  </div>
                </div>
              </div>

              {/* Reseña 5 */}
              <div className="bloque-resena">
                <h3 className="titulo-libro-resena">Latidos que nunca dije</h3>
                <p className="subtitulo-libro-resena">por Loren Jinx</p>
                <div className="estrellas-resena">★★★★★</div>
                <p className="texto-resena">
                  “Como amante de la poesía, agradezco la belleza del lenguaje y la sensibilidad con la que está escrita.”
                </p>
                <div className="info-lector-resena">
                  <img src="/resena5.jpg" alt="John Mark" className="imagen-lector-resena" />
                  <div className="datos-lector-resena">
                    <p className="nombre-lector-resena">John Mark</p>
                    <p className="ocupacion-lector-resena">Creador de contenido</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Flecha derecha */}
            <button className="flecha-resenas derecha" onClick={scrollResenasDerecha}>
              <ChevronRight size={20} />
            </button>
          </div>
        </div>


        {/* Sección libro del mes */}
        <div className="seccion-libro-mes">
          <h2 className="titulo-libro-mes">El libro del mes</h2>

          <div className="contenido-libro-mes">

            {/* Columna izquierda: imagen */}
            <div className="columna-imagen-libro">
              <img
                src={`http://localhost:9001/uploads/${libroMes.imagenes[0].ruta}`}
                alt={libroMes.nombreProducto}
                className="imagen-libro-mes"
              />
            </div>

            {/* Columna derecha: información */}
            <div className="columna-info-libro">
              <h3 className="nombre-libro-mes">{libroMes.nombreProducto}</h3>

              <p className="autor">{libroMes.autor || "Autor desconocido"}</p>

              <div className="contenedor-precio">
                <span className="precio-libro-mes">{libroMes.precio}€</span>
              </div>

              <div className="acciones-libro">
                <div className="boton-cantidad">
                  <button className="simbolo-cantidad" onClick={decrementarCantidad}>−</button>
                  <span className="numero-cantidad">{cantidad}</span>
                  <button className="simbolo-cantidad" onClick={incrementarCantidad}>+</button>
                </div>

                <button
                  className="boton-carrito"
                  onClick={() => {
                    if (!user) {
                      setMostrarAvisoCarrito(true);
                      return;
                    }

                    handleAddToCart({
                      idProducto: libroMes.idProducto,
                      cantidad: cantidad
                    });

                    setMensaje("Producto añadido al carrito");
                    setTimeout(() => setMensaje(""), 2000);
                  }}
                >
                  AÑADIR AL CARRITO
                </button>
              </div>

              <p className="resumen-libro">{libroMes.resumen}</p>
            </div>
          </div>
        </div>


        {/* Sección extractos */}
        <div className="seccion-extractos">
          <h2 className="titulo-extractos">Extractos</h2>

          <div className="contenedor-extractos">
            {/* Columna 1 */}
            <div className="columna-extracto">
              <img src="/extracto1.jpg" alt="Extracto libro 1" className="imagen-extracto" />
              <h3 className="titulo-libro-extracto">My America</h3>
              <p className="texto-extracto">"¿Qué significa vivir en un país donde las personas responsables de proteger a sus ciudadanos pueden verse tan a menudo implicadas en sus muertes?”</p>
              <p className="fecha-extracto">Publicado: 12/05/1955</p>
            </div>

            {/* Columna 2 */}
            <div className="columna-extracto">
              <img src="/extracto2.jpg" alt="Extracto libro 2" className="imagen-extracto" />
              <h3 className="titulo-libro-extracto">Ricardo Martín</h3>
              <p className="texto-extracto">Una saga familiar marcada por la magia y la historia.</p>
              <p className="fecha-extracto">Publicado: 20/07/2023</p>
            </div>

            {/* Columna 3 */}
            <div className="columna-extracto">
              <img src="/extracto3.jpg" alt="Extracto libro 3" className="imagen-extracto" />
              <h3 className="titulo-libro-extracto">El camino del despertar</h3>
              <p className="texto-extracto">"El deseo de alcanzar salud, prosperidad y felicidad requiere un cambio profundo en nuestra forma de ser, pues sin esa transformación interior es imposible lograr esas metas."</p>
              <p className="fecha-extracto">Publicado: 01/09/2023</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
