import "./Comunidad.css";
import CrearPublicacion from "../components/Comunidad/CrearPublicacion"
import Feed from "../components/Comunidad/Feed";
import SidebarDerecha from "../components/Comunidad/SidebarDerecha";

export default function Comunidad() {
  return (
    <div className="comunidad-page">

      <div className="columna-izquierda">
        <CrearPublicacion />
        <Feed />
      </div>

      <div className="columna-derecha comunidad-card">
        <SidebarDerecha />
      </div>

    </div>
  );
}