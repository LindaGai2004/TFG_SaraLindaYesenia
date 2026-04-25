import "./Comunidad.css";
import Feed from "../components/Comunidad/Feed";
import SidebarDerecha from "../components/Comunidad/SidebarDerecha";

export default function Comunidad() {
  return (
    <div className="comunidad-wrapper"> {/* Nuevo contenedor */}
      <div className="comunidad-page">
        <div className="columna-izquierda">
          <Feed />
        </div>
        <div className="columna-derecha comunidad-card">
          <SidebarDerecha />
        </div>
      </div>
    </div>
  );
}