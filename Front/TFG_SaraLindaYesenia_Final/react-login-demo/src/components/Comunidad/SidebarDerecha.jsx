import { useEffect, useState } from "react";
import api from "../../api/api";

export default function SidebarDerecha() {
  const [usuarios, setUsuarios] = useState([]);
  const [libros, setLibros] = useState([]);

  useEffect(() => {
    cargarUsuarios();
    cargarLibros();
  }, []);

  {/* Usuarios recomendados */}
  async function cargarUsuarios() {
    try {
      const res = await api.apiGet("/recomendados");
      setUsuarios(Array.isArray(res) ? res : []);
    } catch (e) {
      console.error("Error cargando usuarios", e);
    }
  }

  {/* Libros populares */}
  async function cargarLibros() {
    try {
      const res = await api.apiGet("/libros/populares");
      setLibros(Array.isArray(res) ? res : []);
    } catch (e) {
      console.error("Error cargando libros", e);
    }
  }


  return (
    <div className="sidebar-derecha">
      <h3>Usuarios recomendados</h3>
      <ul>
        {usuarios.length === 0 && <li>No hay usuarios aún</li>}
        {usuarios.map(u => (
          <li key={u.idUsuario}>
            {u.nombre} {u.apellidos} — {u.totalPublicaciones} posts
          </li>
        ))}
      </ul>

      <h3>Libros populares</h3>
      <ul>
        {libros.length === 0 && <li>No hay libros aún</li>}
        {libros.map(l => (
          <li key={l.idLibro}>
            {l.titulo} — {l.autor}
          </li>
        ))}
      </ul>
    </div>
  );
}