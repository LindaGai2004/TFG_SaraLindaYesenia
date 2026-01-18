import { useCart } from '../context/CartContext';
import {useNavigate} from 'react-router-dom';

function MiCarrito() {
    const {cartItems, addToCart, increaseCantidad, decreaseCantidad, quitarFromCart} = useCart();
    const navigate = useNavigate();
    const testProduct = {
        id_producto:1,
        nombre: 'Test Book',
        precio: 10
    };
    const subtotal = cartItems.reduce(
        (acc, item) => acc + item.precio * item.cantidad,
        0
    );
    const iva = subtotal * 0.21;
    const total = subtotal + iva;
    return (
        <div style={{paddingTop:'120px'}}>
            <h1>Mi Carrito</h1>
            <button onClick={() => addToCart(testProduct)}>
                Añadir uno
            </button>
            {cartItems.length === 0 ?(
                <p>Tu carrito esta vacio</p>
            ) : (
                <ul>
                    {cartItems.map(item=>(
                        <li key={item.id_producto} style={{marginBottom:'16px'}}>
                            <strong>{item.nombre}</strong> - ${item.precio}
                            <div>
                                <button onClick={() => decreaseCantidad(item.id_producto)}>-</button>
                                <span style={{margin: '0 10px'}}>
                                    {item.cantidad}
                                </span>
                                <button onClick={() => increaseCantidad(item.id_producto)}>+</button>
                            </div>
                            <div>
                                Subtotal: ${item.precio * item.cantidad}
                            </div>
                            <button onClick = {() => quitarFromCart(item.id_producto)} style={{ marginLeft: '10px' }}>🗑️</button>
                        </li>
                    ))}
                    {cartItems.length > 0 && (
                        <div style={{marginTop: '24px'}}>
                            <hr/>
                            <p>Subtotal: ${subtotal.toFixed(2)}</p>
                            <p>IVA: ${iva.toFixed(2)}</p>
                            <p>Total: ${total.toFixed(2)}</p>
                            <button onClick ={()=>{
                                if (cartItems.length === 0){
                                    alert ('El carrito esta vacio');
                                    return;
                                }
                                navigate('/checkout');
                            }}>
                                Finalizar compra
                            </button>
                        </div>
                    )}
                </ul>
            )}
        </div>
    );
}

export default MiCarrito;

