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
  const cleanPath = path.trim().split("?")[0].replace(/\/+$/, "");
  const query = path.includes("?") ? "?" + path.split("?")[1] : "";

  // SOLO estas rutas son públicas
  const isPublic =
    cleanPath.startsWith("/auth") ||
    cleanPath === "/registro" ||
    cleanPath === "/api/login" ||
    cleanPath === "/publicaciones"; // SOLO GET general

  const headers = isFormData
    ? { ...(isPublic ? {} : getAuthHeader()) }
    : { "Content-Type": "application/json", ...(isPublic ? {} : getAuthHeader()) };

  const options = {
    method: "POST",
    headers,
    body: isFormData ? body : JSON.stringify(body)
  };

  const res = await fetch(`${BASE_URL}${cleanPath}${query}`, options);

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

export async function apiDelete(path) {
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
}

export default {
  apiGet,
  apiPost,
  apiPut,
  apiDelete
};