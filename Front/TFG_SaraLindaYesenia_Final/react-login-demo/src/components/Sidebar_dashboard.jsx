import { BarChart2, BookOpen, ShoppingBag, Users, Settings, LogOut, Heart } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
const navSections = [
  {
    title: 'MENU',
    items: [
      { id: 'dashboard', label: 'Dashboard', icon: BarChart2 },
    ]
  },
  {
    title: 'PERSONAL',
    items: [
      { id: 'jefes', label: 'Jefes', icon: Users },
      { id: 'trabajadores', label: 'Trabajadores', icon: Users },
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
      { id: 'admin', label: 'Mi Datos', icon: Settings },
      { id: 'favoritos', label: 'Favoritos', icon: Heart, onlyClient: true }
    ]
  },
];

export default function Sidebar({ currentPage, onNavigate, onLogout }) {
  const { user, logout } = useAuth();
  return (
    <aside className="sidebar">
      {/* Logo */}
      <div className="sidebar-logo">
        <div className="sidebar-logo-inner">
          <div className="sidebar-logo-icon"> Archives <img src="/libro.png" alt="Logo" className="sidebar-logo-img" /></div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        {navSections.map((section, idx) => (
          <div key={idx}>
            <p className="sidebar-section-title">{section.title}</p>
            {section.items.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;

              if (item.onlyClient && Users?.rol !== "CLIENTE") {
                return null;
              }

              return (
                <div key={item.id}>
                  <button
                    onClick={() => onNavigate(item.id)}
                    className={`sidebar-nav-item ${isActive ? 'active' : ''}`}
                  >
                    <Icon size={15} />
                    {item.label}
                  </button>

                  {/* Sub-menu for Productos */}
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
        {/* Logout */}
      <a className="app-sidebar-link logout-link" onClick={logout}>
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
          <polyline points="16 17 21 12 16 7" />
          <line x1="21" y1="12" x2="9" y2="12" />
        </svg>
      </a>
      </nav>

      

    </aside>
  );
}
