import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { apiGet, apiPost, apiDelete } from '../../api/api';
import './CartSidebar.css';

export default function CartSidebar({ isOpen, onClose }) {
  const { cartItems, increaseCantidad, decreaseCantidad, quitarFromCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [favoritosIds, setFavoritosIds] = useState([]);
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    if (isOpen && user) {
      apiGet('/usuarios/favoritos')
        .then(data => {
          setFavoritosIds(data.map(f => f.idProducto));
        })
        .catch(err => console.error("Error cargando favoritos:", err));
    }
  }, [isOpen, user]);

  const toggleFavorito = async (idProducto) => {
    if (!user) {
      setMensaje("Inicia sesión para guardar favoritos 🔑");
      setTimeout(() => setMensaje(""), 2000);
      return;
    }
    const esFavorito = favoritosIds.includes(idProducto);
    try {
      if (esFavorito) {
        await apiDelete(`/usuarios/favoritos/${idProducto}`);
        setFavoritosIds(prev => prev.filter(id => id !== idProducto));
        setMensaje("Eliminado de favoritos");
      } else {
        await apiPost(`/usuarios/favoritos/${idProducto}`);
        setFavoritosIds(prev => [...prev, idProducto]);
        setMensaje("Añadido a favoritos ✨");
      }
      setTimeout(() => setMensaje(""), 2000);
    } catch (error) {
      console.error("Error al actualizar favorito:", error);
    }
  };

  // --- LÓGICA DE CÁLCULOS ---
  const subtotal = cartItems?.reduce((acc, item) => acc + (item.precioUnidad * item.cantidad), 0) || 0;
  const iva = subtotal * 0.21;
  const delivery = subtotal > 0 ? 2.00 : 0; 
  const total = subtotal + iva + delivery;

  return (
    <>
      <div className={`cart-overlay ${isOpen ? 'active' : ''}`} onClick={onClose} />
      {mensaje && <div className="notificacion-toast-sidebar">{mensaje}</div>}

      <div className={`cart-sidebar ${isOpen ? 'open' : ''}`}>
        <div className="cart-sidebar-header">
          <h2>Tu Carrito</h2>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>

        <div className="cart-sidebar-items">
          {!cartItems || cartItems.length === 0 ? (
            <p className="empty-msg">Tu carrito está vacío</p>
          ) : (
            cartItems.map((item) => {
              const imgPrincipal = item.imagenes?.find(img => img.tipo === "PRINCIPAL")?.ruta;
              const idParaAccion = item.idProducto || item.id_producto;
              const isFav = favoritosIds.includes(idParaAccion);

              return (
                <div key={idParaAccion} className="sidebar-item">
                  <div className="sidebar-item-img">
                    <img 
                      src={imgPrincipal ? `http://localhost:9001/uploads/${imgPrincipal}` : "/default-product.png"} 
                      alt={item.nombreProducto} 
                    />
                  </div>

                  <div className="sidebar-item-info">
                    <div className="info-top">
                      <strong>{item.nombreProducto}</strong>
                      <p className="item-subtitle">{item.autor || item.marca}</p>
                    </div>

                    <div className="info-bottom">
                      <div className="sidebar-quantity-controls">
                        <button onClick={() => decreaseCantidad(idParaAccion)}>−</button>
                        <span>{item.cantidad}</span>
                        <button onClick={() => increaseCantidad(idParaAccion)}>+</button>
                      </div>
                      <span className="sidebar-item-price">€{(item.precioUnidad * item.cantidad).toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="sidebar-item-actions">
                    <button className="action-btn favorite" onClick={() => toggleFavorito(idParaAccion)}>
                      <img src={isFav ? "/corazon_negro.png" : "/corazon_blanco.png"} alt="Fav" />
                    </button>
                    <button className="action-btn delete" onClick={() => quitarFromCart(idParaAccion)}>
                      <img src="/eliminar_negro.png" alt="Eliminar" />
                    </button>
                  </div>
                </div>
              );
            })
          )}

          {/* --- FOOTER  --- */}
          {cartItems?.length > 0 && (
            <div className="cart-sidebar-footer">
              <div className="cart-summary-box">
                <div className="cart-summary-line">
                  <span>Subtotal</span>
                  <span>€{subtotal.toFixed(2)}</span>
                </div>
                <div className="cart-summary-line">
                  <span>Delivery</span>
                  <span>€{delivery.toFixed(2)}</span>
                </div>
                <div className="cart-summary-line">
                  <span>IVA (21%)</span>
                  <span>€{iva.toFixed(2)}</span>
                </div>
                <div className="cart-summary-total">
                  <span>Total</span>
                  <span>€{total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {cartItems?.length > 0 && (
          <div className="cart-sidebar-sticky-footer" onClick={() => { onClose(); navigate('/carrito'); }}>
            <button className="view-cart-btn">IR A PAGAR</button>
          </div>
        )}
      </div>
    </>
  );
}