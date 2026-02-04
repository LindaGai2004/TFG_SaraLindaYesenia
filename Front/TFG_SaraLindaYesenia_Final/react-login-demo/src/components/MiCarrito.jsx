import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import './MiCarrito.css';
function MiCarrito() {
    const { cartItems, addToCart, increaseCantidad, decreaseCantidad, quitarFromCart } = useCart();
    const navigate = useNavigate();
    const testProduct = {
        id_producto: 1,
        nombre: 'Test Book',
        precio: 10
    };
    const subtotal = cartItems.reduce(
        (acc, item) => acc + item.precio * item.cantidad,
        0
    );
    const delivery = 2.00;
    const iva = subtotal * 0.21;
    const total = subtotal + iva;
useEffect(() => {
  if (cartItems.length === 0) {
    addToCart(1, 1);
  }
}, [cartItems, addToCart]);
    return (
           <div className="cart-page">
            <button className="cart-back-btn" onClick={() => navigate(-1)}>
                ← Regresar
            </button>
            
            <h1 className="cart-title">Mi Carrito</h1>
            
            {cartItems.length === 0 ? (
                <p className="cart-empty">Tu carrito está vacío</p>
            ) : (
                <div className="cart-list">
                    <div className="cart-items-container">
                        <div className="cart-table-header">
                            <span>Productos</span>
                            <span>Cantidad</span>
                            <span>Precio</span>
                        </div>
                        
                        {cartItems.map(item => (
                            <div key={item.id_producto} className="cart-item">
                                <div className="cart-item-image"></div>
                                
                                <div className="cart-item-info">
                                    <div className="cart-item-author">Jordan Avery</div>
                                    <strong className="cart-item-name">{item.nombre}</strong>
                                    <div className="cart-item-price">
                                        €{(item.precio??0).toFixed(2)}
                                        <span className="cart-item-price-old">€20.00</span>
                                    </div>
                                </div>
                                
                                <div className="cart-quantity-controls">
                                    <button
                                        className="cart-btn cart-btn-decrease"
                                        onClick={() => decreaseCantidad(item.id_producto)}
                                    >
                                        −
                                    </button>
                                    <span className="cart-quantity">
                                        {item.cantidad}
                                    </span>
                                    <button
                                        className="cart-btn cart-btn-increase"
                                        onClick={() => increaseCantidad(item.id_producto)}
                                    >
                                        +
                                    </button>
                                </div>
                                
                                <button
                                    className="cart-btn-remove"
                                    onClick={() => quitarFromCart(item.id_producto)}
                                >
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="3 6 5 6 21 6"></polyline>
                                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                        <line x1="10" y1="11" x2="10" y2="17"></line>
                                        <line x1="14" y1="11" x2="14" y2="17"></line>
                                    </svg>
                                </button>
                                
                                <div className="cart-item-subtotal">
                                    €{(item.precio * item.cantidad).toFixed(2)}
                                </div>
                            </div>
                        ))}
                    </div>
                    
                    <div className="cart-summary">
                        <div className="cart-summary-line">
                            <span>Subtotal</span>
                            <span>€{subtotal.toFixed(2)}</span>
                        </div>
                        <div className="cart-summary-line">
                            <span>Delivery</span>
                            <span>€{delivery.toFixed(2)}</span>
                        </div>
                        <div className="cart-summary-line">
                            <span>IVA</span>
                            <span>€{iva.toFixed(2)}</span>
                        </div>
                        
                        <div className="cart-summary-total">
                            <span>Total</span>
                            <span>€{total.toFixed(2)}</span>
                        </div>
                        
                        <div className="cart-summary-subtitle">
                            Instrucciones especiales para el envío
                        </div>
                        <textarea 
                            className="cart-instructions"
                            placeholder=""
                        ></textarea>
                    </div>
                </div>
            )}
            
            {cartItems.length > 0 && (
                <div className="cart-actions">
                    <button
                        className="cart-btn-secondary"
                        onClick={() => navigate(-1)}
                    >
                        Regresar
                    </button>
                    
                    <button
                        className="cart-checkout-btn"
                        onClick={() => {
                            if (cartItems.length === 0) {
                                alert('El carrito está vacío');
                                return;
                            }
                            navigate('/success');
                        }}
                    >
                        Finalizar compra
                    </button>
                </div>
            )}
        </div>
    );
}

export default MiCarrito;

