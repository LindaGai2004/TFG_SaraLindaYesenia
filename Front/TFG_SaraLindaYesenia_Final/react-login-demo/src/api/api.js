const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:9001';

// Mira en localStorage si hay un usuario guardado
function getAuthHeader() {
  const stored = localStorage.getItem('user');
  // Si tiene token, devuelvo: Authorization: Bearer <token>
  // Si no hay token, devuelvo un objeto vacío.
  if (!stored) return {};
  const parsed = JSON.parse(stored);
  return parsed?.token ? { 'Authorization': `Bearer ${parsed.token}` } : {};
}

// Si el backend dice que el token no vale, borra la sesión y te mandoa al login
function forceLogout() {
  localStorage.removeItem("user");
  localStorage.removeItem("token");
  localStorage.removeItem("cartItems");
  window.location.href = "/login";
}

export async function apiGet(path) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: {
      ...getAuthHeader()
    }
  });

  if (res.status === 401) {
    forceLogout();
    return;
  }

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Error GET ${path}`);
  }

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

  if (res.status === 401) {
    forceLogout();
    return;
  }

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Error POST ${path}`);
  }

  const text = await res.text();
  return text ? JSON.parse(text) : null;
}

export async function apiPut(path, body) {
  try {
    const res = await fetch(`${BASE_URL}${path}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify(body)
    });

    if (res.status === 401) {
      forceLogout();
      return;
    }

    if (!res.ok) {
      const text = await res.text();
      throw new Error(text || `Error PUT ${path}`);
    }

    const text = await res.text();
    return text ? JSON.parse(text) : null;

  } catch (error) {
    console.error('PUT request failed:', error);
    throw error;
  }
}

export async function apiDelete(path) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader()
    }
  });

  if (res.status === 401) {
    forceLogout();
    return;
  }
  
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Error DELETE ${path}`);
  }

  const text = await res.text();
  return text ? JSON.parse(text) : null;
}

export default {
  apiGet,
  apiPost,
  apiPut,
  apiDelete
};