import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar_dashboard';
import Header from '../components/Header_dashboard';
import Dashboard from './Dashboard/DashboardPrincipal_Admin';
import Productos from './Dashboard/ProductosDashboard_Admin';
import Clientes from './Dashboard/ClientesDashboard_Admin';
import Jefes from './Dashboard/Jefes_Admin';
import Trabajadores from './Dashboard/Trabajadores_Admin';
import Pedidos from './Dashboard/Pedidos_Admin';
import AdminConfig from './Dashboard/AdminConfig';
import api from '../api/api';
import './Administrador.css';
import { apiGet, apiPost, apiPut, apiDelete } from '../api/api';
import { useAuth } from '../context/AuthContext';

function App() {
  const { user } = useAuth();
  const [page, setPage] = useState('dashboard');
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(null);
  const [books, setBooks] = useState([]);
  const [papeleria, setPapeleria] = useState([]);
  const [clients, setClients] = useState([]);
  const [jefes, setJefes] = useState([]);
  const [trabajadores, setTrabajadores] = useState([]);
  const [pedidos, setPedidos] = useState([]);
  const [mensual, setMensual] = useState([]);
  const [mensualTotal, setMensualTotal] = useState(0);
  const [admin, setAdmin] = useState(null);

  const showNotification = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  useEffect(() => {
    fetchAllData();
  }, [user?.email]);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const adminList = await apiGet('/rol/1');
      const libroData = await apiGet('/libros/todos');
      const papeleriaData = await apiGet('/papelerias/todos');
      const clienteData = await apiGet('/rol/2');
      const jefeData = await apiGet('/rol/4');
      const trabajadorData = await apiGet('/rol/3');
      const pedidosData = await apiGet('/pedidos/todos');
      const mensualData = await apiGet('/pedidos/mensual');
      const mensualTotalData = await apiGet('/pedidos/mensual/total');
      const currentAdmin = adminList.find((item) => item.email === user?.email) ?? adminList[0] ?? {};

      setAdmin(currentAdmin);
      setBooks(libroData);
      setPapeleria(papeleriaData);
      setClients(clienteData);
      setJefes(jefeData);
      setTrabajadores(trabajadorData);
      setPedidos(pedidosData);
      setMensual(mensualData);
      setMensualTotal(mensualTotalData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const addBook = async (bookData) => {
    try {
      await apiPost('/libros/altaLibro', bookData);
      await fetchAllData();
      showNotification('success', 'Libro anadido correctamente');
    } catch (error) {
      alert(`ERROR: ${error.message}`);
      showNotification('error', error.message || 'Error al anadir libro');
      throw error;
    }
  };

  const editBook = async (idProducto, bookData) => {
    try {
      await apiPut(`/libros/modificarLibro/${idProducto}`, bookData);
      await fetchAllData();
      showNotification('success', 'Libro modificado correctamente');
    } catch (error) {
      showNotification('error', error.message || 'Error al modificar libro');
      throw error;
    }
  };

  const deleteBook = async (idProducto) => {
    try {
      await apiDelete(`/productos/eliminar/${idProducto}`);
      await fetchAllData();
      showNotification('success', 'Libro eliminado correctamente');
    } catch (error) {
      showNotification('error', error.message || 'Error al eliminar libro');
      throw error;
    }
  };

  const addPapeleria = async (data) => {
    try {
      await apiPost('/papelerias/altaPapeleria', data);
      await fetchAllData();
      showNotification('success', 'Producto de papeleria anadido correctamente');
    } catch (error) {
      showNotification('error', error.message || 'Error al anadir papeleria');
      throw error;
    }
  };

  const editPapeleria = async (idProducto, data) => {
    try {
      await apiPut(`/papelerias/modificarPapeleria/${idProducto}`, data);
      await fetchAllData();
      showNotification('success', 'Papeleria modificada correctamente');
    } catch (error) {
      showNotification('error', error.message || 'Error al modificar papeleria');
      throw error;
    }
  };

  const deletePapeleria = async (idProducto) => {
    try {
      await apiDelete(`/productos/eliminar/${idProducto}`);
      await fetchAllData();
      showNotification('success', 'Papeleria eliminada correctamente');
    } catch (error) {
      showNotification('error', error.message || 'Error al eliminar papeleria');
      throw error;
    }
  };

  const editClient = async (email, data) => {
    try {
      await apiPut(`/usuario/${email}`, data);
      await fetchAllData();
      showNotification('success', 'Cliente modificado correctamente');
    } catch (error) {
      showNotification('error', error.message || 'Error al modificar cliente');
      throw error;
    }
  };

  const deleteClient = async (id) => {
    try {
      await apiDelete(`/usuario/${id}`);
      await fetchAllData();
      showNotification('success', 'Cliente eliminado correctamente');
    } catch (error) {
      showNotification('error', error.message);
      throw error;
    }
  };

  const addJefe = async (data) => {
    try {
      await apiPost('/admin/crear', { ...data, perfil: { idPerfil: 4 } });
      await fetchAllData();
      showNotification('success', 'Jefe anadido correctamente');
    } catch (error) {
      showNotification('error', error.message || 'Error al anadir jefe');
      throw error;
    }
  };

  const editJefe = async (email, data) => {
    try {
      await apiPut(`/usuario/${email}`, data);
      await fetchAllData();
      showNotification('success', 'Jefe modificado correctamente');
    } catch (error) {
      showNotification('error', error.message || 'Error al modificar jefe');
      throw error;
    }
  };

  const deleteJefe = async (id) => {
    try {
      await apiDelete(`/usuario/${id}`);
      await fetchAllData();
      showNotification('success', 'Usuario eliminado correctamente');
    } catch (error) {
      showNotification('error', error.message);
      throw error;
    }
  };

  const addTrabajador = async (data) => {
    try {
      await apiPost('/admin/crear', { ...data, perfil: { idPerfil: 3 } });
      await fetchAllData();
      showNotification('success', 'Trabajador anadido correctamente');
    } catch (error) {
      showNotification('error', error.message || 'Error al anadir trabajador');
      throw error;
    }
  };

  const editTrabajador = async (email, data) => {
    try {
      await apiPut(`/usuario/${email}`, data);
      await fetchAllData();
      showNotification('success', 'Trabajador modificado correctamente');
    } catch (error) {
      showNotification('error', error.message || 'Error al modificar trabajador');
      throw error;
    }
  };

  const deleteTrabajador = async (id) => {
    try {
      await apiDelete(`/usuario/${id}`);
      await fetchAllData();
      showNotification('success', 'Usuario eliminado correctamente');
    } catch (error) {
      showNotification('error', error.message);
      throw error;
    }
  };

  const cancelPedido = async (id) => {
    try {
      await api.pedidos.cancel(id);
      setPedidos((prev) => prev.map((o) => (o.id === id ? { ...o, estado: 'Cancelado' } : o)));
    } catch (error) {
      console.error('Error canceling Pedido:', error);
      throw error;
    }
  };

  const updateAdmin = async (updatedAdmin) => {
    setAdmin(updatedAdmin);
    showNotification('success', 'Administrador modificado correctamente');
  };

  const pageComponents = {
    dashboard: Dashboard,
    productos: Productos,
    clientes: Clientes,
    jefes: Jefes,
    trabajadores: Trabajadores,
    pedidos: Pedidos,
    admin: AdminConfig,
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
      <Sidebar currentPage={page} onNavigate={setPage} />

      <div className="main-wrapper">
        <Header usuario={admin} />

        <main className="main-content">
          <div className="main-content-inner">
            <PageComponent
              books={books}
              papeleria={papeleria}
              clients={clients}
              jefes={jefes}
              trabajadores={trabajadores}
              pedidos={pedidos}
              mensual={mensual}
              mensualTotal={mensualTotal}
              usuario={admin}
              onAddBook={addBook}
              onEditBook={editBook}
              onDeleteBook={deleteBook}
              onAddPapeleria={addPapeleria}
              onEditPapeleria={editPapeleria}
              onDeletePapeleria={deletePapeleria}
              onEditClient={editClient}
              onDeleteClient={deleteClient}
              onAddJefe={addJefe}
              onEditJefe={editJefe}
              onDeleteJefe={deleteJefe}
              onAddTrabajador={addTrabajador}
              onEditTrabajador={editTrabajador}
              onDeleteTrabajador={deleteTrabajador}
              onCancelPedido={cancelPedido}
              onUpdateUsuario={updateAdmin}
            />
          </div>
        </main>

        {notification && (
          <div className="modal-overlay active">
            <div className={`modal-content ${notification.type === 'success' ? 'modal-success' : 'modal-error'}`}>
              <div style={{ textAlign: 'center', padding: '25px' }}>
                <div
                  style={{
                    width: '90px',
                    height: '90px',
                    borderRadius: '50%',
                    backgroundColor: notification.type === 'success' ? '#6d96a6' : '#DB504A',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto',
                  }}
                >
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

export default App;
