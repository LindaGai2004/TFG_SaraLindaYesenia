//import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import React, { useEffect } from 'react';
import { useState } from 'react';
import { apiGet, apiPost, apiPut, apiDelete } from '../api/api';
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
    const subtotal = carrito?.subtotal ?? 0;
    const iva = carrito?.iva ?? 0;
    const total = carrito?.total ?? 0;
    //Mostrrar delivery fijo
    const delivery = 2.00;
    return (
        <div className="cart-page">
            <button className="cart-back-btn" onClick={() => navigate(-1)}>
                ← Regresar
            </button>



            {items.length === 0 ? (
                <div className="cart-empty-state">
                    <h2 className="cart-empty-title">Tu carrito esta vacío</h2>
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

                        {items.map((item, index) => (
                            <div key={index} className="cart-item">
                                <div className="cart-item-image"></div>

                                <div className="cart-item-info">
                                    <div className="cart-item-author">{item.autor}</div>
                                    <strong className="cart-item-name">{item.nombreProducto}</strong>
                                    <div className="cart-item-price">
                                        €{item.precioUnidad.toFixed(2)}
                                    </div>
                                </div>

                                <div className="cart-quantity-controls">
                                    <button
                                        onClick={() =>
                                            apiPut("/carrito/update", {
                                                idProducto: item.idProducto,
                                                cantidad: item.cantidad - 1

                                            })
                                                .then(() => apiGet("/carrito").then(setCarrito))
                                        }
                                        disabled={item.cantidad <= 1}
                                    >
                                        −
                                    </button>

                                    <span>{item.cantidad}</span>

                                    <button
                                        onClick={() =>
                                            apiPut("/carrito/update", {
                                                idProducto: item.idProducto,
                                                cantidad: item.cantidad + 1
                                            })
                                                .then(() => apiGet("/carrito").then(setCarrito))
                                        }

                                    >
                                        +
                                    </button>

                                </div>

                                <button
                                    className="cart-btn-remove"
                                    onClick={() =>
                                        apiDelete(`/carrito/delete/${item.idProducto}`)
                                            .then(() => apiGet("/carrito").then(setCarrito))
                                    }
                                >
                                    🗑️
                                </button>

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
                        onClick={async () => {
                            try {
                                const pedido = await apiPost("/carrito/checkout");
                                navigate(`/checkout/${pedido.idPedido}`, {
                                    // Pasamos los datos del carrito que ya tenemos
                                    state: {
                                        subtotal,
                                        iva,
                                        total,
                                        delivery,
                                        items
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

