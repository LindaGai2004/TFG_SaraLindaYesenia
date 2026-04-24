import { useState, useRef, useEffect } from "react";
import "./Chatbot.css";

const MONOLITO_URL = "http://localhost:9001";
const CHATBOT_URL = "http://localhost:8081";

function MensajeBot({ mensaje, onEnviar }) {
  return (
    <div className="chat-mensaje bot">
      <div className="chat-burbuja">
        <p dangerouslySetInnerHTML={{
          __html: mensaje.texto
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\n/g, '<br/>')
        }} />
        {mensaje.productos && mensaje.productos.length > 0 && (
          <div className="chat-productos">
            {mensaje.productos.map((p, i) => (
              <div key={i} className="chat-producto-card"
                style={{ cursor: "pointer" }}
                onClick={() => window.location.href = `/producto/${p.idProducto}`}>
                {p.imagenUrl && (
                  <img src={`${MONOLITO_URL}/${p.imagenUrl}`}
                    alt={p.nombreProducto} className="chat-producto-img" />
                )}
                <div className="chat-producto-info">
                  <span className="chat-producto-nombre">{p.nombreProducto}</span>
                  {p.autor && <span className="chat-producto-autor">{p.autor}</span>}
                  <span className="chat-producto-precio">{p.precio}€</span>
                </div>
              </div>
            ))}
          </div>
        )}
        {mensaje.categorias && mensaje.categorias.length > 0 && (
          <div className="chat-sugerencias" style={{ marginTop: "8px" }}>
            {mensaje.categorias.map((c, i) => (
              <button key={i} className="chat-sugerencia-btn"
                onClick={() => onEnviar(c)}>{c}</button>
            ))}
          </div>
        )}
        {mensaje.linkProducto && (
          <a href={mensaje.linkProducto} className="chat-btn-ver-producto">
            Ver producto →
          </a>
        )}
        {mensaje.linkSeccion && (
          <a href={mensaje.linkSeccion} className="chat-btn-ver-producto"
            style={{ display: "block", textAlign: "center", marginTop: "10px" }}>
            Ver más en la tienda →
          </a>
        )}
        {mensaje.necesitaSoporte && (
          <button className="chat-btn-soporte"
            onClick={() => window.location.href = "/contacto"}>
            Contactar con soporte
          </button>
        )}
      </div>
    </div>
  );
}

export default function Chatbot() {
  const mensajeInicial = {
    tipo: "bot",
    texto: "¡Hola! 👋 Soy el asistente de Archives, tu librería online de confianza. Estoy aquí para ayudarte a encontrar tu próximo libro o artículo de papelería. ¿En qué puedo ayudarte hoy? 😊",
    productos: [], necesitaSoporte: false,
  };

  const [abierto, setAbierto] = useState(false);
  const [mensajes, setMensajes] = useState([mensajeInicial]);
  const [input, setInput] = useState("");
  const [cargando, setCargando] = useState(false);
  const [ultimoProducto, setUltimoProducto] = useState(null);
  const [historial, setHistorial] = useState([]);
  const [despedido, setDespedido] = useState(false); // ← aquí, al nivel del componente
  const finRef = useRef(null);

  useEffect(() => {
    finRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [mensajes, cargando]);

  const sugerencias = [
    "Recomiéndame un libro 📚",
    "Buscar papelería 🎒",
    "Info sobre envíos 📦",
    "Política de devoluciones ↩️",
  ];

  const generosLibro = [
    "Terror 😱", "Romance 💕", "Aventura ⚔️",
    "Fantasía 🔮", "Clásicos 📖", "Misterio 🕵️",
    "Filosofía 💭", "Sorpréndeme ✨"
  ];

  const categoriasPapeleria = [
    "Mochilas 🎒", "Cuadernos y libretas 📓",
    "Agendas 📅", "Papel 📄", "Otros 🏷️"
  ];

  const opcionesNoEncontrado = [
    "📚 Ver otros géneros",
    "🎒 Buscar papelería",
    "↩️ Volver al menú"
  ];

  const resetChat = () => {
    setMensajes([mensajeInicial]);
    setUltimoProducto(null);
    setHistorial([]);
    setDespedido(false); // ← limpia al resetear
  };

  const construirLinkSeccion = (texto) => {
    const t = texto.toLowerCase();
    if (t.includes("mochila")) return "/productos?tipo=papeleria&categoria=Mochilas";
    if (t.includes("agenda")) return "/productos?tipo=papeleria&categoria=Agendas";
    if (t.includes("cuaderno") || t.includes("libreta")) return "/productos?tipo=papeleria&categoria=Cuadernos%2C%20libretas%20y%20recambios";
    if (t.includes("papel")) return "/productos?tipo=papeleria&categoria=Papel";
    if (t.includes("terror")) return "/productos?tipo=libro&genero=Terror";
    if (t.includes("romance")) return "/productos?tipo=libro&genero=Romance";
    if (t.includes("fantas")) return "/productos?tipo=libro&genero=Fantas%C3%ADa";
    if (t.includes("aventura")) return "/productos?tipo=libro&genero=Aventura";
    if (t.includes("misterio")) return "/productos?tipo=libro&genero=Misterio";
    if (t.includes("filosof")) return "/productos?tipo=libro&genero=Filosof%C3%ADa";
    if (t.includes("cl") && t.includes("sico")) return "/productos?tipo=libro&genero=Cl%C3%A1sicos";
    return null;
  };

  const mapaCategorias = {
    "Cuadernos y libretas 📓": "cuaderno",
    "Mochilas 🎒": "mochila",
    "Agendas 📅": "agenda",
    "Papel 📄": "papel",
    "Terror 😱": "terror",
    "Romance 💕": "romance",
    "Aventura ⚔️": "aventura",
    "Fantasía 🔮": "fantasía",
    "Clásicos 📖": "clásicos",
    "Misterio 🕵️": "misterio",
    "Filosofía 💭": "filosofía",
  };

  const enviarMensaje = async (texto) => {
    if (!texto.trim() || cargando) return;
    if (despedido) return; // ← bloquea si ya se despidió

    setMensajes((prev) => [...prev, { tipo: "usuario", texto }]);
    setInput("");

    // Volver al menú
    if (texto.toLowerCase().includes("menu") ||
      texto.toLowerCase().includes("menú") ||
      texto.toLowerCase().includes("volver") ||
      texto.toLowerCase().includes("reiniciar")) {
      setTimeout(resetChat, 300);
      return;
    }

    // Despedida — va ANTES que esConfirmacion
    const esDespedida = ["gracias", "perfecto", "genial", "listo", "eso es todo",
      "nada más", "nada mas", "hasta luego", "adiós", "adios", "ok gracias",
      "está bien gracias", "esta bien gracias", "ese está bien", "ese esta bien"]
      .some(p => texto.toLowerCase().includes(p));

    if (esDespedida) {
      setDespedido(true);
      setMensajes((prev) => [...prev, {
        tipo: "bot",
        texto: "¡De nada! 😊 Espero haberte ayudado. ¡Hasta pronto!",
        productos: [], necesitaSoporte: false,
      }]);
      return;
    }

    // Sorpréndeme
    if (texto.includes("Sorpréndeme")) {
      const generos = ["Terror", "Romance", "Aventura", "Fantasía", "Clásicos", "Misterio"];
      const random = generos[Math.floor(Math.random() * generos.length)];
      enviarMensaje(random);
      return;
    }

    // Ver otros géneros
    if (texto.includes("Ver otros géneros") || texto.includes("Buscar otro género")) {
      setMensajes((prev) => [...prev, {
        tipo: "bot",
        texto: "¿Qué género te apetece explorar?",
        productos: [], necesitaSoporte: false,
        categorias: generosLibro,
      }]);
      return;
    }

    // Confirmación de interés en el último producto
    const esConfirmacion = ["sí", "si", "me interesa", "quiero", "lo quiero",
      "me lo quedo", "añadir", "comprar"]
      .some(p => texto.toLowerCase().trim() === p ||
        texto.toLowerCase().trim().startsWith(p + " "));

    if (esConfirmacion && ultimoProducto) {
      setMensajes((prev) => [...prev, {
        tipo: "bot",
        texto: "¡Perfecto! Aquí puedes verlo:",
        productos: [ultimoProducto],
        necesitaSoporte: false,
        linkProducto: `/producto/${ultimoProducto.idProducto}`
      }]);
      return;
    }

    // Recomiéndame un libro
    if (texto.includes("Recomiéndame un libro")) {
      setMensajes((prev) => [...prev, {
        tipo: "bot",
        texto: "¿Qué tipo de libro te apetece?",
        productos: [], necesitaSoporte: false,
        categorias: generosLibro,
      }]);
      return;
    }

    // Buscar papelería
    if (texto.includes("Buscar papelería") ||
      texto.toLowerCase() === "papelería" ||
      texto.toLowerCase() === "papeleria") {
      setMensajes((prev) => [...prev, {
        tipo: "bot",
        texto: "¿Qué tipo de papelería buscas?",
        productos: [], necesitaSoporte: false,
        categorias: categoriasPapeleria,
      }]);
      return;
    }

    // Otros
    if (texto.includes("Otros")) {
      setMensajes((prev) => [...prev, {
        tipo: "bot",
        texto: "Aquí tienes más categorías de papelería:",
        productos: [], necesitaSoporte: false,
        categorias: ["Bloc de notas", "Etiquetas", "Papel de regalo", "Tarjetas"],
      }]);
      return;
    }

    const textoEnviado = mapaCategorias[texto] || texto;
    const nuevoHistorial = [...historial, { role: "user", content: textoEnviado }];

    setCargando(true);
    try {
      const res = await fetch(`${CHATBOT_URL}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mensaje: textoEnviado, historial: historial }),
      });
      const data = await res.json();

      setHistorial([...nuevoHistorial, { role: "assistant", content: data.respuesta }]);

      if (data.productos && data.productos.length > 0) {
        setUltimoProducto(data.productos[0]);
      }

      const hayProductos = data.productos && data.productos.length > 0;
      const esNoEncontrado = !hayProductos &&
        (data.respuesta.includes("no tenemos") ||
          data.respuesta.includes("no encontré") ||
          data.respuesta.includes("no encontre"));
      const esLibro = hayProductos && data.productos[0].tipoProducto === "LIBRO";

      setMensajes((prev) => [...prev, {
        tipo: "bot",
        texto: data.respuesta,
        productos: data.productos || [],
        necesitaSoporte: data.necesitaSoporte || false,
        linkSeccion: hayProductos ? construirLinkSeccion(textoEnviado) : null,
        categorias: hayProductos
          ? esLibro
            ? ["Buscar otro género", "↩ Volver al menú"]
            : ["↩ Volver al menú"]
          : esNoEncontrado ? opcionesNoEncontrado : [],
      }]);

    } catch {
      setMensajes((prev) => [...prev, {
        tipo: "bot",
        texto: "Lo siento, ha ocurrido un error. Inténtalo de nuevo.",
        productos: [], necesitaSoporte: false,
      }]);
    } finally {
      setCargando(false);
    }
  };

  return (
    <>
      <button className="chat-fab" onClick={() => setAbierto(!abierto)}
        aria-label="Abrir chatbot">
        {abierto ? "✕" : "✦"}
      </button>

      {abierto && (
        <div className="chat-ventana">
          <div className="chat-header">
            <span className="chat-header-titulo">Asistente Archives</span>
            <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
              <button className="chat-header-reset" onClick={resetChat}
                title="Nueva conversación">↺</button>
              <button className="chat-header-cerrar"
                onClick={() => setAbierto(false)}>✕</button>
            </div>
          </div>

          <div className="chat-mensajes">
            {mensajes.map((m, i) =>
              m.tipo === "bot" ? (
                <MensajeBot key={i} mensaje={m} onEnviar={enviarMensaje} />
              ) : (
                <div key={i} className="chat-mensaje usuario">
                  <div className="chat-burbuja">{m.texto}</div>
                </div>
              )
            )}

            {mensajes.length === 1 && (
              <div className="chat-sugerencias">
                {sugerencias.map((s, i) => (
                  <button key={i} className="chat-sugerencia-btn"
                    onClick={() => enviarMensaje(s)}>{s}</button>
                ))}
              </div>
            )}

            {cargando && (
              <div className="chat-mensaje bot">
                <div className="chat-burbuja chat-cargando">
                  <span /><span /><span />
                </div>
              </div>
            )}
            <div ref={finRef} />
          </div>

          <div className="chat-input-area">
            <input type="text" value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && enviarMensaje(input)}
              placeholder="Escribe tu mensaje..."
              className="chat-input"
              disabled={despedido} />
            <button className="chat-enviar" onClick={() => enviarMensaje(input)}
              disabled={cargando || despedido}>➤</button>
          </div>
        </div>
      )}
    </>
  );
}