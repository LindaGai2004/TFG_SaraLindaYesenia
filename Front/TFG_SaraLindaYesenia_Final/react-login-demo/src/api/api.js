const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:9001';

// Mira en localStorage si hay un usuario guardado
function getAuthHeader() {
  const stored = localStorage.getItem('user');
  if (!stored) return {};
  const parsed = JSON.parse(stored);
  return parsed?.token ? { 'Authorization': `Bearer ${parsed.token}` } : {};
}

function handle401() { 
  console.error("Token inválido o caducado"); 
  localStorage.setItem("token_expirado", "true"); // Guarda el aviso para el login
  localStorage.removeItem("user"); 
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
  const res = await fetch(`${BASE_URL}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeader()
    },
    body: JSON.stringify(body)
  });

  if (res.status === 401) return handle401();

  if (!res.ok) throw new Error (await res.text());

  const text = await res.text();
  return text ? JSON.parse(text) : null;
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