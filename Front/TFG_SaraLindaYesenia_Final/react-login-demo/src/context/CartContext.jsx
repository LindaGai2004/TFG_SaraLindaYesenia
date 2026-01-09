//El CartContext sirve para guardar el estado del carrito globalmente
//Persiste en localStorage

import { createContext, useContext, useEffect, useState } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export function CartProvider({ children }) {
  //Un carrito es una lista de items que se inicializa vacio
  const [cartItems, setCartItems] = useState([]);

  //Abrir el carrito guardado
  useEffect(() => {
    const storedCart = localStorage.getItem('cartItems');
    if (storedCart) {
      try {
        setCartItems(JSON.parse(storedCart));
      } catch (e) {
        console.error('No se pudieron cargar los productos del carrito', e);
        setCartItems([]);
      }
    }
  }, []);

  // Se usa cuando cambia el estado del carrito y lo mantiene(persiste)
  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  //Visible para los componentes
  const value = {
    cartItems,
    setCartItems, // we’ll replace this later with addToCart, removeFromCart
  };

  //Significa que los componentes de este Provider pueden acceder al carrito (route, pages, botones pueden leerlo)
  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}