const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:9001';

// Mira en localStorage si hay un usuario guardado
function getAuthHeader() {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

function handle401() { 
  console.error("Token inválido o caducado"); 
  localStorage.setItem("token_expirado", "true"); // Guarda el aviso para el login
  localStorage.removeItem("user"); 
  localStorage.removeItem("token"); 
  localStorage.removeItem("cartItems"); 
  localStorage.removeItem("dl_option"); 
  window.location.href = "/login"; 
}

export async function apiGet(path) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: {...getAuthHeader()}
  });

  if (res.status === 401) return handle401();

  if (!res.ok) throw new Error (await res.text());

  const text = await res.text();
  return text ? JSON.parse(text) : null;
}

export async function apiPost(path, body) {
  const isPublic =
    path.startsWith("/auth") ||
    path === "/registro" ||
    path === "/api/login";

  const headers = {
    "Content-Type": "application/json",
    ...(isPublic ? {} : getAuthHeader())
  };

  const options = {
    method: "POST",
    headers
  };

  // Solo añadir body si existe
  if (body !== undefined && body !== null) {
    options.body = JSON.stringify(body);
  }

  const res = await fetch(`${BASE_URL}${path}`, options);

  if (res.status === 401) return handle401();

  if (!res.ok) throw new Error(await res.text());

  const contentType = res.headers.get("content-type");

  if (contentType && contentType.includes("application/json")) {
    return await res.json();
  }

  return await res.text();
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