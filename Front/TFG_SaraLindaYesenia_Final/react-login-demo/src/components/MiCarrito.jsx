//import { useCart } from '../context/CartContext';
import {useNavigate } from 'react-router-dom';
import React, { useEffect } from 'react';
import { useState } from 'react';
import { apiGet } from '../api/api';
import './MiCarrito.css';
function MiCarrito() {
    const navigate = useNavigate();
    const [carrito, setCarrito] = useState(null);
    useEffect(() => {
        apiGet("/carrito")
            .then(setCarrito)
            .catch(err => {
                console.error(err);
                alert("Error cargando el carrito");
            });
    }, []);


    const items = carrito?.items ?? [];
    const subtotal = items.reduce(
        (acc, item) => acc + item.totalPorItem,
        0
    );
    const delivery = 2.00;
    const iva = subtotal * 0.21;
    const total = subtotal + iva;
   
    return (
        <div className="cart-page">
            <button className="cart-back-btn" onClick={() => navigate(-1)}>
                ← Regresar
            </button>

            <h1 className="cart-title">Mi Carrito</h1>

            {items.length === 0 ? (
                <p className="cart-empty">Tu carrito está vacío</p>
            ) : (
                <div className="cart-list">
                    <div className="cart-items-container">
                        <div className="cart-table-header">
                            <span>Productos</span>
                            <span>Cantidad</span>
                            <span>Precio</span>
                        </div>

                        {items.map((item, index) => (
                            <div key={index} className="cart-item">
                                <div className="cart-item-image"></div>

                                <div className="cart-item-info">
                                    <div className="cart-item-author">Jordan Avery</div>
                                    <strong className="cart-item-name">{item.nombreProducto}</strong>
                                    <div className="cart-item-price">
                                        €{item.precioUnidad.toFixed(2)}
                                    </div>
                                </div>

                                <div className="cart-quantity-controls">
                                    <span className="cart-quantity">{item.cantidad}</span>
                                </div>

                                

                                <div className="cart-item-subtotal">
                                    €{item.totalPorItem.toFixed(2)}
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

            {items.length > 0 && (
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
                            if (items.length === 0) {
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

