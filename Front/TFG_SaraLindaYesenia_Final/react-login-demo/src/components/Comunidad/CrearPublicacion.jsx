import { useState } from "react";
import api from "../../api/api";
import { getApiUrl } from "../../api/api";
import "./CrearPublicacion.css";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function CrearPublicacion({ onPublicada }) {
  const [texto, setTexto] = useState("");
  const [imagen, setImagen] = useState(null);
  const [busqueda, setBusqueda] = useState("");
  const [resultados, setResultados] = useState([]);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [mostrarAvisoLogin, setMostrarAvisoLogin] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();
  const avatar = user?.avatar ?? user?.fotoPerfil ?? user?.imagenPerfil ?? "";

  const handleImagen = (e) => {
    const file = e.target.files[0];
    if (file) setImagen(file);
  };

  const buscarProductos = async (query) => {
    setBusqueda(query);
    if (query.length > 2) {
      try {
        const res = await api.apiGet(`/productos/buscar/todos?texto=${query}`);
        setResultados(Array.isArray(res) ? res : []);
      } catch (e) {
        console.error("Error buscando productos", e);
      }
    } else {
      setResultados([]);
    }
  };

  const seleccionarProducto = (prod) => {
    setProductoSeleccionado(prod);
    setResultados([]);
    setBusqueda("");
  };

  const handlePublicar = async () => {
    if (!texto.trim() && !imagen) return;
    //para q redirect a login si no esta logueado
    if (!user) {
      setMostrarAvisoLogin(true);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("idUsuario", user.idUsuario);
      formData.append("texto", texto);

      if (imagen) formData.append("imagen", imagen);
      if (productoSeleccionado) {
        formData.append("idProducto", productoSeleccionado.idProducto);
      }

      // 🔥 IMPORTANTE: backend puede no devolver nada
      const nuevaPub = await api.apiPost("/publicaciones", formData, true);

      // 🔥 SI NO DEVUELVE NADA → recargar feed
      if (onPublicada) {
        onPublicada(nuevaPub || null);
      }

      // limpiar
      setTexto("");
      setImagen(null);
      setProductoSeleccionado(null);

    } catch (e) {
      console.error("Error publicando", e);
    }
  };

  return (
    <div className="crear-publicacion">
      {mostrarAvisoLogin && (
        <div className="notificacion-login">
          <p>Debes iniciar sesión para publicar.</p>
          <div className="notificacion-botones">
            <button className="btn-login-aviso"
              onClick={() => navigate('/login', { state: { from: window.location.pathname } })}>
              Ir al login
            </button>
            <button className="btn-cerrar-aviso" onClick={() => setMostrarAvisoLogin(false)}>
              Cerrar
            </button>
          </div>
        </div>
      )}
      <div className="crear-top">
        <img
          src={avatar ? getApiUrl(avatar) : "/assets/default-user.png"}
          alt="usuario"
          className="crear-avatar"
        />

        <textarea
          className="crear-textarea"
          placeholder="¿Qué estás leyendo hoy?"
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
        />
      </div>

      <div className="seccion-producto">
        {!productoSeleccionado ? (
          <div className="buscador-libros">
            <input
              type="text"
              placeholder="Etiquetar un libro o producto..."
              value={busqueda}
              onChange={(e) => buscarProductos(e.target.value)}
            />
            {resultados.length > 0 && (
              <ul className="lista-resultados">
                {resultados.map((p) => (
                  <li key={p.idProducto} onClick={() => seleccionarProducto(p)}>
                    {p.nombreProducto} - {p.precio}€
                  </li>
                ))}
              </ul>
            )}
          </div>
        ) : (
          <div className="producto-etiquetado">
            <span>{productoSeleccionado.nombreProducto}</span>
            <button onClick={() => setProductoSeleccionado(null)}>✖</button>
          </div>
        )}
      </div>

      {imagen && (
        <div className="preview-imagen">
          <img src={URL.createObjectURL(imagen)} alt="preview" />
          <button onClick={() => setImagen(null)}>✖</button>
        </div>
      )}

      <div className="crear-bottom">
        <label className="btn-subir">
          Foto del libro
          <input type="file" accept="image/*" onChange={handleImagen} />
        </label>

        <button className="btn-publicar" onClick={handlePublicar}>
          Publicar
        </button>
      </div>
    </div>
  );
}
