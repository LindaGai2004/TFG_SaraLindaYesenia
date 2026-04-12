import { useEffect, useState } from "react";
import api from "../../api/api";
import "./SidebarDerecha.css";

export default function SidebarDerecha() {
  const [usuarios, setUsuarios] = useState([]);
  
  // Obtenemos el usuario de forma segura
  const userData = localStorage.getItem("user");
  const user = userData ? JSON.parse(userData) : null;

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
    console.log("¡Botón pulsado para el usuario!", idSeguido);
    
    // Leemos el usuario directamente del storage cuando se hace click
    const storedUser = JSON.parse(localStorage.getItem("user"));
    console.log("Usuario recuperado en el click:", storedUser);
    const miId = storedUser?.idUsuario || storedUser?.id;

    if (!miId) {
        alert("No se encuentra tu sesión. Por favor, cierra sesión y vuelve a entrar.");
        return;
    }

    if (miId === idSeguido) {
        console.warn("No puedes seguirte a ti mismo");
        return;
    }

    try {
        // Hacemos la petición
        const res = await api.apiPost(`/usuarios/${idSeguido}/seguir?idUsuarioActual=${miId}`);
        console.log("Respuesta servidor:", res);

        if (res && typeof res.siguiendo !== 'undefined') {
            setUsuarios(prevUsuarios => 
                prevUsuarios.map(u => 
                    u.idUsuario === idSeguido 
                        ? { ...u, siguiendo: res.siguiendo } 
                        : u
                )
            );
        }
    } catch (e) {
        console.error("Error al seguir:", e);
    }
  };

  return (
    <div className="sidebar-derecha">
      <h3>Usuarios recomendados</h3>

      <ul className="lista-recomendados">
        {usuarios.length === 0 && <li>No hay usuarios aún</li>}

        {usuarios.map(u => (
          // 1. Verificamos que 'u' existe
          // 2. No te mostramos a ti mismo en la lista
          u && u.idUsuario !== user?.idUsuario && (
            <li key={u.idUsuario} className="usuario-recomendado">
              <img
                src={u.avatar ? `http://localhost:9001${u.avatar}` : "/default-avatar.png"}
                alt="avatar"
                className="avatar"
              />

              <div className="info">
                <strong>{u.nombre} {u.apellidos}</strong>
                <span>{u.totalPublicaciones} publicaciones</span>
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