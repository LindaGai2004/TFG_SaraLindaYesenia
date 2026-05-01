import { useState, useEffect } from 'react';
import Sidebar_Jefe from '../components/Sidebar_Jefe';
import Header from '../components/Header_dashboard';
import DashboardJefe from './Dashboard/Jefe/DashboardPrincipal_Jefe';
import ProductosJefe from './Dashboard/Jefe/ProductosDashboard_Jefe';
import ClientesJefe from './Dashboard/Jefe/ClientesDashboard_Jefe';
import TrabajadoresJefe from './Dashboard/Jefe/Trabajadores_Jefe';
import PedidosJefe from './Dashboard/Jefe/Pedidos_Jefe';
import JefeConfig from './Dashboard/Jefe/JefeConfig';
import './Administrador.css';
import { apiGet, apiPut, apiPost, apiDelete } from '../api/api';
import { useAuth } from '../context/AuthContext';

function JefeDashboard() {
  const { user } = useAuth();
  const [page, setPage] = useState('dashboard');
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(null);
  const [books, setBooks] = useState([]);
  const [papeleria, setPapeleria] = useState([]);
  const [clients, setClients] = useState([]);
  const [trabajadores, setTrabajadores] = useState([]);
  const [pedidos, setPedidos] = useState([]);
  const [jefe, setJefe] = useState(null);

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
      const jefeList = await apiGet('/rol/4');
      const libroData = await apiGet('/libros/todos');
      const papeleriaData = await apiGet('/papelerias/todos');
      const clienteData = await apiGet('/rol/2');
      const trabajadorData = await apiGet('/rol/3');
      const pedidosData = await apiGet('/pedidos/todos');
      const currentJefe = jefeList.find((j) => j.email === user?.email) || jefeList[0] || {};

      setJefe(currentJefe);
      setBooks(libroData);
      setPapeleria(papeleriaData);
      setClients(clienteData);
      setTrabajadores(trabajadorData);
      setPedidos(pedidosData);
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const editBook = async (id, data) => {
    try {
      await apiPut(`/libros/modificarLibro/${id}`, data);
      await fetchAllData();
      showNotification('success', 'Libro modificado correctamente');
    } catch (err) {
      showNotification('error', err.message);
      throw err;
    }
  };

  const editPapeleria = async (id, data) => {
    try {
      await apiPut(`/papelerias/modificarPapeleria/${id}`, data);
      await fetchAllData();
      showNotification('success', 'Papeleria modificada correctamente');
    } catch (err) {
      showNotification('error', err.message);
      throw err;
    }
  };

  const addTrabajador = async (data) => {
    try {
      await apiPost('/admin/crear', { ...data, perfil: { idPerfil: 3 } });
      await fetchAllData();
      showNotification('success', 'Trabajador anadido correctamente');
    } catch (err) {
      showNotification('error', err.message);
      throw err;
    }
  };

  const editTrabajador = async (email, data) => {
    try {
      await apiPut(`/usuario/${email}`, data);
      await fetchAllData();
      showNotification('success', 'Trabajador modificado correctamente');
    } catch (err) {
      showNotification('error', err.message);
      throw err;
    }
  };

  const deleteTrabajador = async (id) => {
    try {
      await apiDelete(`/usuario/${id}`);
      await fetchAllData();
      showNotification('success', 'Trabajador eliminado correctamente');
    } catch (err) {
      showNotification('error', err.message);
      throw err;
    }
  };

  const updateJefe = async (updatedJefe) => {
    setJefe(updatedJefe);
  };

  const pageComponents = {
    dashboard: DashboardJefe,
    productos: ProductosJefe,
    clientes: ClientesJefe,
    trabajadores: TrabajadoresJefe,
    pedidos: PedidosJefe,
    config: JefeConfig,
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
      <Sidebar_Jefe currentPage={page} onNavigate={setPage} />
      <div className="main-wrapper">
        <Header usuario={jefe} />
        <main className="main-content">
          <div className="main-content-inner">
            <PageComponent
              books={books}
              papeleria={papeleria}
              clients={clients}
              trabajadores={trabajadores}
              pedidos={pedidos}
              usuario={jefe}
              onEditBook={editBook}
              onEditPapeleria={editPapeleria}
              onAddTrabajador={addTrabajador}
              onEditTrabajador={editTrabajador}
              onDeleteTrabajador={deleteTrabajador}
              onUpdateUsuario={updateJefe}
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

export default JefeDashboard;
