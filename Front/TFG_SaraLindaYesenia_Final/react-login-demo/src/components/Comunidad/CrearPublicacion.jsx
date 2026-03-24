import { useState } from "react";
import api from "../../api/api";
import "./CrearPublicacion.css";

export default function CrearPublicacion({ onPublicada }) {
  const [texto, setTexto] = useState("");
  const [imagen, setImagen] = useState(null);

  const handleImagen = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagen(file);
    }
  };

  const handlePublicar = async () => {
    if (!texto.trim() && !imagen) return;

    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) return alert("Debes iniciar sesión");

    const formData = new FormData();
    formData.append("idUsuario", user.idUsuario);
    formData.append("texto", texto);
    if (imagen) formData.append("imagen", imagen);

    try {
      // El backend debe devolver la publicación creada (DTO)
      const nuevaPub = await api.apiPost("/publicaciones", formData, true);

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
          src="/assets/default-user.png"
          alt="usuario"
          className="crear-avatar"
        />

        <textarea
          placeholder="¿Qué estás leyendo o pensando hoy?"
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
        />
      </div>

      {imagen && (
        <div className="preview-imagen">
          <img src={URL.createObjectURL(imagen)} alt="preview" />
          <button className="btn-eliminar" onClick={() => setImagen(null)}>
            ✖
          </button>
        </div>
      )}

      <div className="crear-bottom">
        <label className="btn-subir">
          📷 Imagen
          <input type="file" accept="image/*" onChange={handleImagen} />
        </label>

        <button className="btn-publicar" onClick={handlePublicar}>
          Publicar
        </button>
      </div>
    </div>
  );
}