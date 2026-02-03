import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar_dashboard';
import Header from '../components/Header_dashboard';
import Dashboard from './Dashboard/Dashboard';
import Productos from './Dashboard/Productos';
import Clientes from './Dashboard/Clientes';
import Jefes from './Dashboard/Jefes';
import Trabajadores from './Dashboard/Trabajadores';
import Pedidos from './Dashboard/Pedidos';
import AdminConfig from './Dashboard/AdminConfig';
import api from '../api/api';
import './Administrador.css';
import { apiGet } from "../api/api";

function App() {
  // ═══ STATE ═══════════════════════════════════════════════════════════════
  const [page, setPage] = useState('dashboard');
  const [loading, setLoading] = useState(true);
  
  // Data from backend
  const [books, setBooks] = useState([]);
  const [stationery, setStationery] = useState([]);
  const [clients, setClients] = useState([]);
  const [jefes, setJefes] = useState([]);
  const [trabajadores, setTrabajadores] = useState([]);
  const [orders, setOrders] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [admin, setAdmin] = useState(null);

  // ═══ FETCH DATA FROM BACKEND ═════════════════════════════════════════════
  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      /*const [
        pedidosData,
        gananciaData,
      ] = await Promise.all([
        api.pedidos.getAll(),
        api.estadisticas.getGananciaMensual(),
      ])*/

      const adminList = await apiGet("/rol/1"); 
      const LibroData = await apiGet("/libros/todos");
      const PapeleriaData = await apiGet("/papelerias/todos");
      const ClienteData = await apiGet("/rol/2");
      const JefeData = await apiGet("/rol/3");
      const TrabajadorData = await apiGet("/rol/4");

      setAdmin(adminList[0] || {});
      setBooks(LibroData);
      setStationery(PapeleriaData);
      setClients(ClienteData);
      setJefes(JefeData);
      setTrabajadores(TrabajadorData)

/*
      setPedidos(pedidosData);
      setMonthlyData(gananciaData);*/
    } catch (error) {
      console.error('Error fetching data:', error);
      // Aquí podrías mostrar una notificación de error al usuario
    } finally {
      setLoading(false);
    }
  };

  // ═══ CRUD OPERATIONS ═════════════════════════════════════════════════════

  // --- LIBROS ---
  const addBook = async (bookData) => {
    try {
      const newBook = await api.libros.create(bookData);
      setBooks(prev => [...prev, newBook]);
    } catch (error) {
      console.error('Error adding book:', error);
      throw error;
    }
  };

  const editBook = async (id, bookData) => {
    try {
      const updatedBook = await api.libros.update(id, bookData);
      setBooks(prev => prev.map(b => b.id === id ? updatedBook : b));
    } catch (error) {
      console.error('Error updating book:', error);
      throw error;
    }
  };

  const deleteBook = async (id) => {
    try {
      await api.libros.delete(id);
      setBooks(prev => prev.filter(b => b.id !== id));
    } catch (error) {
      console.error('Error deleting book:', error);
      throw error;
    }
  };

  // --- PAPELERÍA ---
  const addStationery = async (data) => {
    try {
      const newItem = await api.papeleria.create(data);
      setStationery(prev => [...prev, newItem]);
    } catch (error) {
      console.error('Error adding papeleria:', error);
      throw error;
    }
  };

  const editStationery = async (id, data) => {
    try {
      const updated = await api.papeleria.update(id, data);
      setStationery(prev => prev.map(s => s.id === id ? updated : s));
    } catch (error) {
      console.error('Error updating papeleria:', error);
      throw error;
    }
  };

  const deleteStationery = async (id) => {
    try {
      await api.stationery.delete(id);
      setStationery(prev => prev.filter(s => s.id !== id));
    } catch (error) {
      console.error('Error deleting papeleria:', error);
      throw error;
    }
  };

  // --- CLIENTES ---
  const editClient = async (id, data) => {
    try {
      const updated = await api.clientes.update(id, data);
      setClients(prev => prev.map(c => c.id === id ? updated : c));
    } catch (error) {
      console.error('Error updating client:', error);
      throw error;
    }
  };

  const deleteClient = async (id) => {
    try {
      await api.clientes.delete(id);
      setClients(prev => prev.filter(c => c.id !== id));
    } catch (error) {
      console.error('Error deleting client:', error);
      throw error;
    }
  };

  // --- JEFES ---
  const addJefe = async (data) => {
    try {
      const newJefe = await api.jefes.create(data);
      setJefes(prev => [...prev, newJefe]);
    } catch (error) {
      console.error('Error adding jefe:', error);
      throw error;
    }
  };

  const editJefe = async (id, data) => {
    try {
      const updated = await api.jefes.update(id, data);
      setJefes(prev => prev.map(j => j.id === id ? updated : j));
    } catch (error) {
      console.error('Error updating jefe:', error);
      throw error;
    }
  };

  const deleteJefe = async (id) => {
    try {
      await api.jefes.delete(id);
      setJefes(prev => prev.filter(j => j.id !== id));
    } catch (error) {
      console.error('Error deleting jefe:', error);
      throw error;
    }
  };

  // --- TRABAJADORES ---
  const addTrabajador = async (data) => {
    try {
      const newTrab = await api.trabajadores.create(data);
      setTrabajadores(prev => [...prev, newTrab]);
    } catch (error) {
      console.error('Error adding trabajador:', error);
      throw error;
    }
  };

  const editTrabajador = async (id, data) => {
    try {
      const updated = await api.trabajadores.update(id, data);
      setTrabajadores(prev => prev.map(t => t.id === id ? updated : t));
    } catch (error) {
      console.error('Error updating trabajador:', error);
      throw error;
    }
  };

  const deleteTrabajador = async (id) => {
    try {
      await api.trabajadores.delete(id);
      setTrabajadores(prev => prev.filter(t => t.id !== id));
    } catch (error) {
      console.error('Error deleting trabajador:', error);
      throw error;
    }
  };

  // --- PEDIDOS ---
  const cancelOrder = async (id) => {
    try {
      await api.pedidos.cancel(id);
      setPedidos(prev => prev.map(o => o.id === id ? { ...o, estado: 'Cancelado' } : o));
    } catch (error) {
      console.error('Error canceling order:', error);
      throw error;
    }
  };

  // --- ADMIN ---
  const updateAdmin = async (data) => {
    try {
      const updated = await api.admin.updatePerfil(data);
      setAdmin(updated);
    } catch (error) {
      console.error('Error updating admin profile:', error);
      throw error;
    }
  };

  const handleLogout = async () => {
    try {
      await api.admin.logout();
      // Redirect to login page or clear session
      window.location.href = '/login';
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  // ═══ PAGE COMPONENTS ═════════════════════════════════════════════════════
  const pageComponents = {
    dashboard: Dashboard,
    productos: Productos,
    clientes: Clientes,
    jefes: Jefes,
    trabajadores: Trabajadores,
    orders: Pedidos,
    admin: AdminConfig,
  };

  const PageComponent = pageComponents[page];
  

  // ═══ RENDER ══════════════════════════════════════════════════════════════
  if (loading) {
    return (
      <div className="admin-layout">
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          width: '100%', 
          height: '100vh',
          fontSize: '1.5rem',
          color: '#2d6a4f'
        }}>
          Cargando...
        </div>
      </div>
    );
  }

  return (
    <div className="admin-layout">
      <Sidebar currentPage={page} onNavigate={setPage} onLogout={handleLogout} />
      
      <div className="main-wrapper">
        <Header admin={admin} />
        
        <main className="main-content">
          <div className="main-content-inner">
            <PageComponent
              books={books}
              stationery={stationery}
              clients={clients}
              jefes={jefes}
              trabajadores={trabajadores}
              orders={orders}
              monthlyData={monthlyData}
              admin={admin}
              onAddBook={addBook}
              onEditBook={editBook}
              onDeleteBook={deleteBook}
              onAddStationery={addStationery}
              onEditStationery={editStationery}
              onDeleteStationery={deleteStationery}
              onEditClient={editClient}
              onDeleteClient={deleteClient}
              onAddJefe={addJefe}
              onEditJefe={editJefe}
              onDeleteJefe={deleteJefe}
              onAddTrabajador={addTrabajador}
              onEditTrabajador={editTrabajador}
              onDeleteTrabajador={deleteTrabajador}
              onCancelOrder={cancelOrder}
              onUpdateAdmin={updateAdmin}
            />
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
