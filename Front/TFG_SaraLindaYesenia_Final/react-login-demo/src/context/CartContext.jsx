//El CartContext sirve para guardar el estado del carrito globalmente
//Persiste en localStorage
import { apiPost, apiGet, apiDelete, apiPut } from '../api/api';
import { createContext, useContext, useEffect, useState } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export function CartProvider({ children }) {
  //Un carrito es una lista de items que se inicializa vacio
  const [cartItems, setCartItems] = useState([]);

  // Función para obtener los datos reales del servidor
  async function refreshCartFromServer() {
    try {
      const token = localStorage.getItem('token');
      if (!token) return; // si no hay token, no hacemos nada
      const data = await apiGet("/carrito");
      // Aseguramos que cargamos la lista de items que devuelve el DTO de Carrito
      setCartItems(data.items || []);
    } catch (e) {
      console.error("Error al refrescar carrito", e);
    }
  }

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      refreshCartFromServer();
    }
  }, []);

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
      // Buscamos el item para saber su cantidad actual
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
        // Si la cantidad es 1 y restamos, lo eliminamos
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

  // Se usa cuando cambia el estado del carrito y lo mantiene(persiste)
  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  //Visible para los componentes
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