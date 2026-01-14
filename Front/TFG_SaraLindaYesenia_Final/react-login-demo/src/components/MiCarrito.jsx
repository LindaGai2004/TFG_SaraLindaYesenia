import { useCart } from '../context/CartContext';


function MiCarrito() {
    //hook
    const { cartItems, addToCart } = useCart();

    const testProduct = {
        id_producto: 1,
        nombre: 'Test Book',
        precio: 10
    };

    return (
        <div>
            <h1>Cart</h1>
            <button onClick={() => addToCart(testProduct)}>
                Añadir Producto
            </button>
            <pre>{JSON.stringify(cartItems, null, 2)}</pre>
        </div>
    );
}

export default MiCarrito;

