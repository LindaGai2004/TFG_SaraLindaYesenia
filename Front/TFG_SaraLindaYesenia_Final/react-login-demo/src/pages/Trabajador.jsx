import { useState, useEffect } from 'react';
import Sidebar_Trabajador from '../components/Sidebar_Trabajador';
import Header from '../components/Header_dashboard';
import DashboardTrabajador from './Dashboard/Trabajador/DashboardPrincipal_Trabajador';
import ProductosTrabajador from './Dashboard/Trabajador/ProductosDashboard_Trabajador';
import ClientesJefe from './Dashboard/Jefe/ClientesDashboard_Jefe';
import PedidosJefe from './Dashboard/Jefe/Pedidos_Jefe';
import TrabajadorConfig from './Dashboard/Trabajador/TrabajadorConfig';
import './Administrador.css';
import { apiGet } from '../api/api';
import { useAuth } from '../context/AuthContext';

function TrabajadorDashboard() {
  const { user } = useAuth();
  const [page, setPage] = useState('dashboard');
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(null);
  const [books, setBooks] = useState([]);
  const [papeleria, setPapeleria] = useState([]);
  const [clients, setClients] = useState([]);
  const [pedidos, setPedidos] = useState([]);
  const [trabajador, setTrabajador] = useState(null);

  const showNotification = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  useEffect(() => {
    fetchAllData();
  }, [user?.email]);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const trabajadorList = await apiGet('/rol/3');
      const libroData = await apiGet('/libros/todos');
      const papeleriaData = await apiGet('/papelerias/todos');
      const clienteData = await apiGet('/rol/2');
      const pedidosData = await apiGet('/pedidos/todos');
      const currentTrabajador = trabajadorList.find((t) => t.email === user?.email) || trabajadorList[0] || {};

      setTrabajador(currentTrabajador);
      setBooks(libroData);
      setPapeleria(papeleriaData);
      setClients(clienteData);
      setPedidos(pedidosData);
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateTrabajador = async (updatedTrabajador) => {
    setTrabajador(updatedTrabajador);
    showNotification('success', 'Datos actualizados correctamente');
  };

  const pageComponents = {
    dashboard: DashboardTrabajador,
    productos: ProductosTrabajador,
    clientes: ClientesJefe,
    pedidos: PedidosJefe,
    config: TrabajadorConfig,
  };

  const PageComponent = pageComponents[page];

  if (loading) {
    return (
      <div className="admin-layout">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100vh', fontSize: '1.5rem', color: '#6d96a6' }}>
          Cargando...
        </div>
      </div>
    );
  }

  return (
    <div className="admin-layout">
      <Sidebar_Trabajador currentPage={page} onNavigate={setPage} />
      <div className="main-wrapper">
        <Header usuario={trabajador} />
        <main className="main-content">
          <div className="main-content-inner">
            <PageComponent
              books={books}
              papeleria={papeleria}
              clients={clients}
              pedidos={pedidos}
              usuario={trabajador}
              onUpdateUsuario={updateTrabajador}
            />
          </div>
        </main>

        {notification && (
          <div className="modal-overlay active">
            <div className={`modal-content ${notification.type === 'success' ? 'modal-success' : 'modal-error'}`}>
              <div style={{ textAlign: 'center', padding: '25px' }}>
                <div style={{ width: '90px', height: '90px', borderRadius: '50%', backgroundColor: notification.type === 'success' ? '#6d96a6' : '#DB504A', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto' }}>
                  <img src={notification.type === 'success' ? '/tick.png' : '/cruz.png'} alt="icon" width="40" />
                </div>
                <h2 style={{ marginTop: '15px' }}>{notification.type === 'success' ? 'Exito' : 'Error'}</h2>
                <p>{notification.message}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default TrabajadorDashboard;
