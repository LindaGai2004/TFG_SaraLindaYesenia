import { useState } from "react";
import api from "../../api/api";
import "./CrearPublicacion.css";

export default function CrearPublicacion({ onPublicada }) {
  const [texto, setTexto] = useState("");
  const [imagen, setImagen] = useState(null);
  const user = JSON.parse(localStorage.getItem("user"));

  const handleImagen = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagen(file);
    }
  };

  
  const handlePublicar = async () => {
    if (!texto.trim() && !imagen) return;

    if (!user) return alert("Debes iniciar sesión");

    try {
      const formData = new FormData();
      formData.append("idUsuario", user.idUsuario);
      formData.append("texto", texto);
      if (imagen) formData.append("imagen", imagen);

      const nuevaPub = await api.apiPost("/publicaciones", formData, true);
      console.log("PUBLICACIÓN CREADA:", nuevaPub);


      if (onPublicada && nuevaPub) {
        onPublicada(nuevaPub);
      }

      setTexto("");
      setImagen(null);

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

      {imagen && (
        <div className="preview-imagen">
          <img src={URL.createObjectURL(imagen)} alt="preview" />
          <button className="btn-eliminar" onClick={() => setImagen(null)}>✖</button>
        </div>
      )}

      <div className="crear-bottom">
        <label className="btn-subir">
          📷 Foto del libro
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