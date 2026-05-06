//El CartContext sirve para guardar el estado del carrito globalmente
//Se sincroniza con el servidor según el usuario logueado
import { apiPost, apiGet, apiDelete, apiPut } from '../api/api';
import { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';

const CartContext = createContext();
export const useCart = () => useContext(CartContext);

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const { user } = useAuth();

  // Función para obtener los datos reales del servidor
  async function refreshCartFromServer() {
    try {
      const token = localStorage.getItem('token');
      if (!token) return; // doble seguridad: si no hay token, no hacemos nada
      const data = await apiGet("/carrito");
      setCartItems(data.items || []);
    } catch (e) {
      console.error("Error al refrescar carrito", e);
    }
  }

  // Reacciona a cambios de usuario:
  // - Login o cambio de usuario → carga carrito desde servidor
  // - Logout → limpia el carrito en memoria
  // - Reload con usuario logueado → AuthContext restaura el user, esto se dispara y vuelve a cargar
  useEffect(() => {
    if (user) {
      refreshCartFromServer();
    } else {
      setCartItems([]);
    }
  }, [user]);

  // Añadir al carrito
  async function addToCart(idProducto, cantidad = 1) {
    try {
      const carritoActualizado = await apiPost("/carrito/add", { idProducto, cantidad });
      setCartItems(carritoActualizado.items || []);
    } catch (e) {
      console.error("Error al añadir al carrito", e);
    }
  }

  async function increaseCantidad(idProducto) {
    try {
      const item = cartItems.find(i => (i.idProducto || i.id_producto) === idProducto);
      if (item) {
        await apiPut("/carrito/update", {
          idProducto: idProducto,
          cantidad: item.cantidad + 1
        });
        await refreshCartFromServer();
      }
    } catch (e) {
      console.error("Error al aumentar cantidad", e);
    }
  }

  async function decreaseCantidad(idProducto) {
    try {
      const item = cartItems.find(i => (i.idProducto || i.id_producto) === idProducto);
      if (item && item.cantidad > 1) {
        await apiPut("/carrito/update", {
          idProducto: idProducto,
          cantidad: item.cantidad - 1
        });
        await refreshCartFromServer();
      } else if (item && item.cantidad === 1) {
        await quitarFromCart(idProducto);
      }
    } catch (e) {
      console.error("Error al disminuir cantidad", e);
    }
  }

  async function quitarFromCart(idProducto) {
    try {
      await apiDelete(`/carrito/delete/${idProducto}`);
      await refreshCartFromServer();
    } catch (e) {
      console.error("Error al quitar del carrito", e);
    }
  }

  const value = {
    cartItems,
    addToCart,
    increaseCantidad,
    decreaseCantidad,
    quitarFromCart,
    refreshCartFromServer
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}