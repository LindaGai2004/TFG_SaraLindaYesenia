const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:9001';

// Mira en localStorage si hay un usuario guardado
function getAuthHeader() {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}


function handle401() { 
  const path = window.location.pathname;

  // No hacer nada en estas páginas
  if (
    path.includes("verificacion") || 
    path.includes("recuperar") || 
    path.includes("verificar-codigo") ||
    path.includes("restablecer") ||
    path.includes("catalogo") ||
    path.includes("producto") ||
    path.includes("comunidad") ||
    path.includes("notificacion") ||
    path.includes("favoritos")
  ) {
    return;
  }

  console.error("Token inválido o caducado"); 
  localStorage.setItem("token_expirado", "true");  // Guarda el aviso para el login
  localStorage.removeItem("user"); 
  localStorage.removeItem("token"); 
  localStorage.removeItem("cartItems"); 
  localStorage.removeItem("dl_option"); 
  window.location.href = "/login"; 
}


export async function apiGet(path) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { ...getAuthHeader() }
  });

  if (res.status === 401) return handle401();
  if (!res.ok) throw new Error(await res.text());

  const text = await res.text();
  return text ? JSON.parse(text) : null;
}


export async function apiPost(path, body, isFormData = false) {
  // 1. Necesitamos cleanPath para saber si la ruta es pública o no
  const cleanPath = path.trim().split("?")[0].replace(/\/+$/, "");

  // 2. Definimos qué rutas no necesitan Token
  const isPublic =
    cleanPath.startsWith("/auth") ||
    cleanPath === "/registro" ||
    cleanPath === "/api/login";

  // 3. Configuramos las cabeceras
  const headers = isFormData
    ? { ...(isPublic ? {} : getAuthHeader()) }
    : { 
        "Content-Type": "application/json", 
        ...(isPublic ? {} : getAuthHeader()) 
      };

  const options = {
    method: "POST",
    headers,
    body: isFormData ? body : JSON.stringify(body)
  };

  // 4. USAMOS EL 'path' ORIGINAL: 
  // Esto es vital para que "/usuarios/2/seguir?idUsuarioActual=3" llegue completo al Back
  const res = await fetch(`${BASE_URL}${path}`, options);

  if (res.status === 401) return handle401();
  if (!res.ok) throw new Error(await res.text());

  return await res.json();
}


export async function apiPut(path, body) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader()
    },
    body: JSON.stringify(body)
  });

  if (res.status === 401) return handle401();

  if (!res.ok) throw new Error (await res.text());

  const text = await res.text();
  return text ? JSON.parse(text) : null;
}

{/*export async function apiDelete(path) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader()
    }
  });

  if (res.status === 401) return handle401();

  if (!res.ok) throw new Error (await res.text());

  const text = await res.text();
  return text ? JSON.parse(text) : null;
} */}

export async function apiDelete(path) {
  // Limpiamos la ruta por si acaso
  const cleanPath = path.trim().split("?")[0].replace(/\/+$/, "");
  const query = path.includes("?") ? "?" + path.split("?")[1] : "";

  const res = await fetch(`${BASE_URL}${cleanPath}${query}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader()
    }
  });

  // Si recibimos 401 (Token caducado)
  if (res.status === 401) return handle401();

  // Si hay error (403, 404, 500...)
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(errorText || "Error al eliminar");
  }

  // Si el borrado fue bien (200 OK)
  const text = await res.text();
  
  try {
    return text ? JSON.parse(text) : true;
  } catch (e) {
    // Si el backend devolvió un texto plano en lugar de JSON
    return { mensaje: text }; 
  }
}

export default {
  apiGet,
  apiPost,
  apiPut,
  apiDelete
};