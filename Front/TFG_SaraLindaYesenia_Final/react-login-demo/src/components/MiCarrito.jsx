import { useCart } from '../context/CartContext';


function MiCarrito() {
    const {cartItems, addToCart} = useCart();
    const testProduct = {
        id_producto:1,
        nombre: 'Test Book',
        precio: 10
    };
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
                        <li key={item.id_producto}>
                            <strong>{item.nombre}</strong> - ${item.precio} <br/>
                            Cantidad: {item.cantidad} <br/>
                            Subtotal: ${item.precio * item.cantidad}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default MiCarrito;

