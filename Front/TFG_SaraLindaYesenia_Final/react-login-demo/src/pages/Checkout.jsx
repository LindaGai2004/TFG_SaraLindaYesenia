import { useCart }  from "../context/CartContext";
import { useAuth }  from "../context/AuthContext";

function Checkout() {
    const {cartItems} = useCart();
    const {user} = useAuth();

    return (
        <div style={{paddingTop: '120px'}}>
            <h1>Confirmar pedido</h1>
            <p><strong>Cliente:</strong> {user?.email}</p>
            <ul>
                {cartItems.map(item => (
                    <li key={item.id_producto}>
                        {item.nombre} - {item.cantidad} x ${item.precio}
                    </li>
                ))}
            </ul>
            <button onClick={() =>{
                console.log('Pedido enviado:', cartItems);
                alert('Pedido confirmado (simulad)');
            }}>
                Confirmar Compra
            </button>
        </div>
    );
}

export default Checkout;