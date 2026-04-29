import { useCart } from '../../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { apiPost, getUploadUrl } from "../../api/api";
import React from 'react';
import './MiCarrito.css';

function MiCarrito() {
    const navigate = useNavigate();
    
    // Obtenemos los datos y funciones directamente del cartcontext
    const { cartItems, increaseCantidad, decreaseCantidad, quitarFromCart } = useCart();

    // Cálculo basados en los items del contexto
    const subtotal = cartItems.reduce((acc, item) => acc + (item.precioUnidad * item.cantidad), 0);
    const iva = subtotal * 0.21;
    //Mostrrar delivery fijo
    const delivery = 2.00;
    const total = subtotal + iva + delivery;

    return (
        <div className="cart-page">
            <button className="cart-back-btn" onClick={() => navigate(-1)}>
                ← Regresar
            </button>

            {cartItems.length === 0 ? (
                <div className="cart-empty-state">
                    <h2 className="cart-empty-title">Tu carrito está vacío</h2>
                    <p className="cart-empty-subtitle">¿Listo para encontrar tus nuevos productos favoritos?</p>
                    <button className="cart-empty-btn" onClick={() => navigate(-1)}>
                        SEGUIR COMPRANDO
                    </button>
                </div>
            ) : (
                <div className="cart-list">
                    <div className="cart-items-container">
                        <div className="cart-table-header">
                            <span>Productos</span>
                            <span>Cantidad</span>
                            <span>Precio</span>
                        </div>

                        {cartItems.map((item) => {
                            const imgPrincipal = item.imagenes?.find(img => img.tipo === "PRINCIPAL")?.ruta;
                            const idParaAccion = item.idProducto || item.id_producto;

                            return (
                                <div key={idParaAccion} className="cart-item">
                                    <div className="cart-item-image">
                                        {imgPrincipal ? (
                                            <img
                                                src={getUploadUrl(imgPrincipal)}
                                                alt={item.nombreProducto}
                                                style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "8px" }}
                                            />
                                        ) : (
                                            <div className="cart-item-img-placeholder" />
                                        )}
                                    </div>

                                    <div className="cart-item-info">
                                        <div className="cart-item-author">{item.autor || item.marca}</div>
                                        <strong className="cart-item-name">{item.nombreProducto}</strong>
                                        <div className="cart-item-price">€{item.precioUnidad.toFixed(2)}</div>
                                    </div>

                                    <div className="cart-quantity-controls">
                                        <button
                                            onClick={() => decreaseCantidad(idParaAccion)}
                                            disabled={item.cantidad <= 1}
                                        >
                                            −
                                        </button>
                                        <span>{item.cantidad}</span>
                                        <button
                                            onClick={() => increaseCantidad(idParaAccion)}
                                        >
                                            +
                                        </button>
                                    </div>

                                    <button
                                        className="cart-btn-remove"
                                        onClick={() => quitarFromCart(idParaAccion)}
                                    >
                                        🗑️
                                    </button>

                                    <div className="cart-item-subtotal">
                                        €{(item.precioUnidad * item.cantidad).toFixed(2)}
                                    </div>
                                </div>
                            );
                        })}
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
                            <span>IVA (21%)</span>
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
                            placeholder="Ej: Dejar en portería..."
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
                        onClick={async () => {
                            try {
                                const pedido = await apiPost("/carrito/checkout");
                                navigate(`/checkout/${pedido.idPedido}`, {
                                    state: {
                                        subtotal,
                                        iva,
                                        total,
                                        delivery,
                                        items: cartItems
                                    }
                                });
                            } catch (e) {
                                console.error(e);
                                alert("Error creando pedido");
                            }
                        }}
                    >
                        Pagar Pedido
                    </button>
                </div>
            )}
        </div>
    );
}

export default MiCarrito;