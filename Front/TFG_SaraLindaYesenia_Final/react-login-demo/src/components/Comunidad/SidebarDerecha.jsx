import { useEffect, useState } from "react";
import api from "../../api/api";
import { getApiUrl } from "../../api/api"; 
import "./SidebarDerecha.css";

async function toggleFollowRequest(idSeguido, miId) {
  return api.apiPost(`/usuarios/${idSeguido}/seguir?idUsuarioActual=${miId}`, {}, true);
}

export default function SidebarDerecha() {
  const [usuarios, setUsuarios] = useState([]);
  
  // Obtenemos el usuario de forma segura
  const userData = localStorage.getItem("user");
  const user = userData ? JSON.parse(userData) : null;
  const token = localStorage.getItem("token");

  useEffect(() => {
    cargarUsuarios();
  }, []);

  async function cargarUsuarios() {
    try {
      const res = await api.apiGet("/recomendados");
      setUsuarios(Array.isArray(res) ? res : []);
    } catch (e) {
      console.error("Error cargando usuarios", e);
    }
  }

  const handleSeguir = async (idSeguido) => {
    // 1. Validaciones previas
    if (!token || !user) {
        alert("Debes iniciar sesión para seguir usuarios");
        return;
    }

    const miId = user?.idUsuario || user?.id;

    if (miId === idSeguido) {
        console.warn("No puedes seguirte a ti mismo");
        return;
    }

    try {
        // 2. Ejecutar la petición al SeguidorRestController
        const res = await toggleFollowRequest(idSeguido, miId);
        console.log("Respuesta servidor:", res);

        // 3. El controlador devuelve un Map, verificamos la clave 'siguiendo'
        // Tu compañera usa ResponseEntity.ok(seguidorService.toggleSeguir(...))
        if (res && typeof res.siguiendo !== 'undefined') {
            setUsuarios(prevUsuarios => 
                prevUsuarios.map(u => 
                    u.idUsuario === idSeguido 
                        ? { ...u, siguiendo: res.siguiendo } 
                        : u
                )
            );
            
            // Disparamos evento para que el feed principal se actualice si es necesario
            window.dispatchEvent(new CustomEvent("community-follow-changed"));
        }
    } catch (e) {
        console.error("Error al seguir:", e);
        if(e.message?.includes("401")) {
            alert("Sesión expirada. Por favor, vuelve a entrar.");
        }
    }
  };

  return (
    <div className="sidebar-derecha">
      <h3>Usuarios recomendados</h3>

      <ul className="lista-recomendados">
        {usuarios.length === 0 && <li>No hay usuarios aún</li>}

        {usuarios.map(u => (
          // Verificamos que el usuario existe y no mostramos al usuario en la lista
          u && u.idUsuario !== user?.idUsuario && (
            <li key={u.idUsuario} className="usuario-recomendado">
              <img
                src={(u.avatar ?? u.fotoPerfil ?? u.imagenPerfil) ? getApiUrl(u.avatar ?? u.fotoPerfil ?? u.imagenPerfil) + '?t=' + Date.now() : "/default-avatar.png"}
                alt="avatar"
                className="avatar"
              />

              <div className="info">
                <strong>{u.nombre} {u.apellidos}</strong>
                <span className="username">@{u.username || 'lector'}</span>
                <span className="stats-sidebar">{u.totalPublicaciones} publicaciones</span>
              </div>

              <button 
                className={`btn-seguir ${u.siguiendo ? "siguiendo" : ""}`}
                onClick={() => handleSeguir(u.idUsuario)}
              >
                {u.siguiendo ? "Siguiendo" : "Seguir"}
              </button>
            </li>
          )
        ))}
      </ul>
    </div>
  );
}
