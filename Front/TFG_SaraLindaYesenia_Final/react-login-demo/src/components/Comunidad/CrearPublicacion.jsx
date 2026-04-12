import { useState } from "react";
import api from "../../api/api";
import "./CrearPublicacion.css";

export default function CrearPublicacion({ onPublicada }) {
  const [texto, setTexto] = useState("");
  const [imagen, setImagen] = useState(null);
  const user = JSON.parse(localStorage.getItem("user"));
  const [busqueda, setBusqueda] = useState("");
  const [resultados, setResultados] = useState([]);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);

  const handleImagen = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagen(file);
    }
  };

  // Función para buscar productos en el bakend
  const buscarProductos = async (query) => {
    setBusqueda(query);
    if (query.length > 2) {
      try {
        const res = await api.apiGet(`/productos/buscar/todos?texto=${query}`);
        // Verificamos que sea un array
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

    if (!user) return alert("Debes iniciar sesión");

    try {
      const formData = new FormData();
      formData.append("idUsuario", user.idUsuario);
      formData.append("texto", texto);
      if (imagen) formData.append("imagen", imagen);

      // enviamos el producto al bakc
      if (productoSeleccionado) {
        formData.append("idProducto", productoSeleccionado.idProducto);
      }

      const nuevaPub = await api.apiPost("/publicaciones", formData, true);
      console.log("PUBLICACIÓN CREADA:", nuevaPub);

      if (onPublicada && nuevaPub) {
        onPublicada(nuevaPub);
      }

      // Se resetea todo
      setTexto("");
      setImagen(null);
      setProductoSeleccionado(null);

    } catch (e) {
      console.error("Error publicando", e);
    }
  };


  return (
    <div className="crear-publicacion">

      <div className="crear-top">
        <img
          src={user?.avatar ? `http://localhost:9001${user.avatar}` : "/assets/default-user.png"}
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


      {/* Buscador de libros */}
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
            <img src="/libro-enlace.png" alt="libro" className="img-libro-enlace" />
            <span>{productoSeleccionado.nombreProducto}</span>
            <button onClick={() => setProductoSeleccionado(null)}>✖</button>
          </div>
        )}
      </div>


      {imagen && (
        <div className="preview-imagen">
          <img src={URL.createObjectURL(imagen)} alt="preview" />
          <button className="btn-eliminar" onClick={() => setImagen(null)}>✖</button>
        </div>
      )}

      <div className="crear-bottom">
        <label className="btn-subir">
          <img src= "/foto-subida.png"
          alt="foto" 
          className="icono-accion" 
          style={{ marginRight: '8px' }} />
          Foto del libro
          <input type="file" accept="image/*" onChange={handleImagen} />
        </label>

        <button
          className="btn-publicar"
          disabled={!texto.trim() && !imagen}
          onClick={handlePublicar}
        >
          Publicar
        </button>
      </div>
    </div>
  );
}