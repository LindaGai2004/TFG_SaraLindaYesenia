import { BarChart2, BookOpen, ShoppingBag, Users, Settings, LogOut, Heart } from 'lucide-react';

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
  return (
    <aside className="sidebar">
      {/* Logo */}
      <div className="sidebar-logo">
        <div className="sidebar-logo-inner">
          <div className="sidebar-logo-icon">📚</div> 
          <span className="sidebar-logo-text">CAMBIAR LOGO</span>
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
      </nav>

      {/* Logout */}
      <div className="sidebar-footer">
        <button className="logout-btn" onClick={onLogout}>
          <LogOut size={14} />
          Cerrar Sesión
        </button>
      </div>
    </aside>
  );
}
