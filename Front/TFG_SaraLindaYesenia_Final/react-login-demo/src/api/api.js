

const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:9001';

export async function apiGet(path) {
  const res = await fetch(`${BASE_URL}${path}`, {
    credentials: 'include'
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Error GET ${path}`);
  }

  const text = await res.text();
  return text ? JSON.parse(text) : null;
}
export async function apiPost(path, body = null) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: 'POST',
    credentials: 'include',
    headers: body ? { 'Content-Type': 'application/json' } : undefined,
    body: body ? JSON.stringify(body) : null,
  });

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
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(errorText || `Error PUT ${path}`);
    }
    return await res.json();
  } catch (error) {
    console.error('PUT request failed:', error);
    throw error;
  }
}

export async function apiDelete(path) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: 'DELETE',
    credentials: 'include',
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Error DELETE ${path}`);
  }

  const text = await res.text();
  return text ? JSON.parse(text) : null;
}

/*
export const librosAPI = {
  // 获取所有图书
  getAll: async () => {
    // 👇【填写路由】例如: '/api/libros' 或 '/libros'
    return await apiGet('/libros/todos');
  },

  // 创建图书
  create: async (libro) => {
    // 👇【填写路由】
    return await apiPost('/libros/altaLibro', libro);
  },

  // 更新图书
  update: async (id, libro) => {
    // 👇【填写路由】
    return await apiPut(`/libros/modificarLibro/${idProducto}`, libro);
  },

  // 删除图书
  delete: async (id) => {
    // 👇【填写路由】
    return await apiDelete(`/eliminar/${idProducto}`);
  },

  // 搜索图书
  search: async (query) => {
    // 👇【填写路由】
    return await apiGet(`/libros/buscar?query=${encodeURIComponent(query)}`);
  },
};*/


export default {
  apiGet,
  apiPost,
  apiPut,
  apiDelete,
  /*  libros: librosAPI,*/
};