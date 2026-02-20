import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar_dashboard';
import Header from '../components/Header_dashboard';
import Dashboard from './Dashboard/Dashboard';
import Productos from './Dashboard/ProductosDashboard';
import Clientes from './Dashboard/Clientes';
import Jefes from './Dashboard/Jefes';
import Trabajadores from './Dashboard/Trabajadores';
import Pedidos from './Dashboard/Pedidos';
import AdminConfig from './Dashboard/AdminConfig';
import api from '../api/api';
import './Administrador.css';
import { apiGet, apiPost, apiPut, apiDelete } from "../api/api";


function App() {
  // STATE
  const [page, setPage] = useState('dashboard');
  const [loading, setLoading] = useState(true);

  const [notification, setNotification] = useState(null);
  
  // Data from backend
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
      const JefeData = await apiGet("/rol/4");
      const TrabajadorData = await apiGet("/rol/3");
      const PedidosData = await apiGet("/pedidos/todos");
      const MensualData = await apiGet("/pedidos/mensual");
      const MensualTotalData = await apiGet("/pedidos/mensual/total")

      setAdmin(adminList[0] || {});
      setBooks(LibroData);
      setPapeleria(PapeleriaData);
      setClients(ClienteData);
      setJefes(JefeData);
      setTrabajadores(TrabajadorData);
      setPedidos(PedidosData);
      setMensual(MensualData);
      setMensualTotal(MensualTotalData);
/*
      setPedidos(pedidosData);
      serMensual(gananciaData);*/
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
  const addPapeleria = async (data) => {
    try {
      const newItem = await api.papeleria.create(data);
      setPapeleria(prev => [...prev, newItem]);
    } catch (error) {
      console.error('Error adding papeleria:', error);
      throw error;
    }
  };

  const editPapeleria = async (id, data) => {
    try {
      const updated = await api.papeleria.update(id, data);
      setPapeleria(prev => prev.map(s => s.id === id ? updated : s));
    } catch (error) {
      console.error('Error updating papeleria:', error);
      throw error;
    }
  };

  const deletePapeleria = async (id) => {
    try {
      await api.Papeleria.delete(id);
      setPapeleria(prev => prev.filter(s => s.id !== id));
    } catch (error) {
      console.error('Error deleting papeleria:', error);
      throw error;
    }
  };

  // --- CLIENTES ---
  const editClient = async (email, data) => {
    try {
      await apiPut(`/usuario/${email}`, data);
      await fetchAllData();
      showNotification("success", "Cliente modificado correctamente");
    } catch (error) {
      showNotification("error", error.message || "Error al modificar cliente");
      throw error;
    }
  };

  const deleteClient = async (id) => {
    try {
      await apiDelete(`/usuario/${id}`);
      await fetchAllData();
      showNotification("success", "Cliente eliminado correctamente");
    } catch (error) {
      showNotification("error", error.message);
      throw error;
    }
  };

  // --- JEFES ---
  const addJefe = async (data) => {
    try {
      const body = {
      ...data,
      perfil: { idPerfil: 4 } 
    };
      await apiPost("/admin/crear", body);
      await fetchAllData();
      showNotification("success", "Jefe añadido correctamente");
  } catch (error) {
    showNotification("error", error.message || "Error al añadir jefe");
    throw error;
  }
  };

  const editJefe = async (email, data) => {
    try {
      await apiPut(`/usuario/${email}`, data);
      await fetchAllData();
      showNotification("success", "Jefe modificado correctamente");
    } catch (error) {
      showNotification("error", error.message || "Error al modificar jefe");
      throw error;
    }
  };

  const deleteJefe = async (id) => {
    try {
      await apiDelete(`/usuario/${id}`);
      await fetchAllData();
      showNotification("success", "Usuario eliminado correctamente");
    } catch (error) {
      showNotification("error", error.message);
      throw error;
    }
  };

  // --- TRABAJADORES ---
  const addTrabajador = async (data) => {
     try {
      const body = {
      ...data,
      perfil: { idPerfil: 3 } 
    };
      await apiPost("/admin/crear", body);
      await fetchAllData();
      showNotification("success", "Trabajador añadido correctamente");
  } catch (error) {
    showNotification("error", error.message || "Error al añadir trabajador");
    throw error;
  }
  };

  const editTrabajador = async (email, data) => {
    try {
      await apiPut(`/usuario/${email}`, data);
      await fetchAllData();
      showNotification("success", "Trabajador modificado correctamente");
    } catch (error) {
      showNotification("error", error.message || "Error al modificar trabajador");
      throw error;
    }
  };

  const deleteTrabajador = async (id) => {
    try{
      await apiDelete(`/usuario/${id}`);
      await fetchAllData();
      showNotification("success", "Usuario eliminado correctamente");
    } catch (error) {
      showNotification("error", error.message);
      throw error;
    }
  };

  // --- PEDIDOS ---
  const cancelPedido = async (id) => {
    try {
      await api.pedidos.cancel(id);
      setPedidos(prev => prev.map(o => o.id === id ? { ...o, estado: 'Cancelado' } : o));
    } catch (error) {
      console.error('Error canceling Pedido:', error);
      throw error;
    }
  };

  // --- ADMIN ---
  const updateAdmin = async (data) => {
    try {
      await apiPut(`/usuario/${data.email}`, data);
      await fetchAllData();
      showNotification("success", "Administrador modificado correctamente");
    } catch (error) {
      showNotification("error", error.message || "Error al modificar administrador");
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
    pedidos: Pedidos,
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
              papeleria={papeleria}
              clients={clients}
              jefes={jefes}
              trabajadores={trabajadores}
              pedidos={pedidos}
              mensual={mensual}
              mensualTotal={mensualTotal}
              admin={admin}
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
              onUpdateAdmin={updateAdmin}
            />
          </div>
        </main>
         {notification && (
          <div className="modal-overlay active">
            <div className={`modal-content ${notification.type === "success" ? "modal-success" : "modal-error"}`}>
              <div style={{ textAlign: "center", padding: "25px" }}>
                <div
                  style={{
                    width: "90px",
                    height: "90px",
                    borderRadius: "50%",
                    backgroundColor:
                      notification.type === "success" ? "#2d6a4f" : "#DB504A",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto"
                  }}
                >
                  <img
                    src={notification.type === "success" ? "/tick.png" : "/cruz.png"}
                    alt="icon"
                    width="40"
                  />
                </div>
                <h2 style={{ marginTop: "15px" }}>
                  {notification.type === "success" ? "¡Éxito!" : "Error"}
                </h2>

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
