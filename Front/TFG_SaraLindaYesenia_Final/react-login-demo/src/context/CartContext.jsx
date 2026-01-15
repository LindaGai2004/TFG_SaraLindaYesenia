//El CartContext sirve para guardar el estado del carrito globalmente
//Persiste en localStorage

import { createContext, useContext, useEffect, useState } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export function CartProvider({ children }) {
  //Un carrito es una lista de items que se inicializa vacio
  const [cartItems, setCartItems] = useState([]);
  function addToCart(producto) {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(
        item => item.id_producto === producto.id_producto
      );

      if (existingItem) {
        return prevItems.map(item =>
          item.id_producto === producto.id_producto
            ? { ...item, cantidad: item.cantidad + 1 }
            : item
        );
      }
      //Si el producto no esta en el carrito -> lo agrega
      return [...prevItems, { ...producto, cantidad: 1 }];
    });
  }
  function increaseCantidad(id_producto){
    setCartItems(prevItems =>
      prevItems.map(
        
      )

    )
  }
  function decreaseCantidad(id_producto){
    
  }
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
    addToCart,
    increaseCantidad,
    decreaseCantidad
  };

  //Significa que los componentes de este Provider pueden acceder al carrito (route, pages, botones pueden leerlo)
  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}