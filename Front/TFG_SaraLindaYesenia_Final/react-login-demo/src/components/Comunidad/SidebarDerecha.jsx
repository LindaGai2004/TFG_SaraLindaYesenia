import { useEffect, useState } from "react";
import api from "../../api/api";
import "./SidebarDerecha.css";

export default function SidebarDerecha() {
  const [usuarios, setUsuarios] = useState([]);

  useEffect(() => {
    cargarUsuarios();
  }, []);

  async function cargarUsuarios() {
    try {
      const res = await api.apiGet("/recomendados");

      console.log("Usuarios recomendados:", res);

      setUsuarios(Array.isArray(res) ? res : []);
    } catch (e) {
      console.error("Error cargando usuarios", e);
    }
  }


  return (
    <div className="sidebar-derecha">
      
      <h3>Usuarios recomendados</h3>

      <ul className="lista-recomendados">
        {usuarios.length === 0 && <li>No hay usuarios aún</li>}

        {usuarios.map(u => (
          <li key={u.idUsuario} className="usuario-recomendado">
            <img
              src={`http://localhost:9001${u.avatar}` || "/default-avatar.png"}
              alt="avatar"
              className="avatar"
            />

            <div className="info">
              <strong>{u.nombre} {u.apellidos}</strong>
              <span>{u.totalPublicaciones} publicaciones</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}