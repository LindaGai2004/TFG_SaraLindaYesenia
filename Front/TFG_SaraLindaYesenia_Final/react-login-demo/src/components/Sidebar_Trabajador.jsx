import { BarChart2, BookOpen, ShoppingBag, Users, Settings } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const navSections = [
  {
    title: 'MENU',
    items: [
      { id: 'dashboard', label: 'Dashboard', icon: BarChart2 },
    ]
  },
  {
    title: 'DATOS',
    items: [
      { id: 'clientes', label: 'Clientes', icon: Users },
      { id: 'productos', label: 'Productos', icon: BookOpen, hasSub: true },
      { id: 'pedidos', label: 'Pedidos', icon: ShoppingBag },
    ]
  },
  {
    title: 'CUENTA',
    items: [
      { id: 'config', label: 'Mi Datos', icon: Settings },
    ]
  },
];

export default function Sidebar_Trabajador({ currentPage, onNavigate }) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  return (
    <aside className="sidebar">
      <div className="sidebar-logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
        <div className="sidebar-logo-inner">
          <div className="sidebar-logo-icon">
            Archives <img src="/libro.png" alt="Logo" className="sidebar-logo-img" />
          </div>
        </div>
      </div>

      <nav className="sidebar-nav">
        {navSections.map((section, idx) => (
          <div key={idx}>
            <p className="sidebar-section-title">{section.title}</p>
            {section.items.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              return (
                <div key={item.id}>
                  <button
                    onClick={() => onNavigate(item.id)}
                    className={`sidebar-nav-item ${isActive ? 'active' : ''}`}
                  >
                    <Icon size={15} />
                    {item.label}
                  </button>
                  {item.hasSub && isActive && (
                    <div className="sidebar-sub-menu">
                      <p className="sidebar-sub-item">📚 Libros</p>
                      <p className="sidebar-sub-item">📎 Papelería</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ))}

        <button
          onClick={logout}
          className="sidebar-nav-item"
          style={{ color: '#94a3b8', transition: 'color 0.2s', fontSize: '0.78rem' }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = '#ef4444';
            e.currentTarget.querySelector('svg').style.stroke = '#ef4444';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = '#94a3b8';
            e.currentTarget.querySelector('svg').style.stroke = '#94a3b8';
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24"
            fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          Cerrar sesión
        </button>
      </nav>
    </aside>
  );
}
