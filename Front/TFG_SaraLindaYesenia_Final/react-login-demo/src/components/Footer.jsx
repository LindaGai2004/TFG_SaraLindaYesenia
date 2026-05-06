import { Link } from "react-router-dom";
import "./Footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="contenedor-footer">

        {/* Columna 1 */}
        <div className="columna-footer">
          <h3 className="titulo-footer">Compañía</h3>
          <a href="/contacto" className="enlace-footer">Contáctanos</a>
          <a href="/tarjeta-regalo" className="enlace-footer">Tarjeta regalo</a>
          <a href="/blog" className="enlace-footer">Blog</a>
          <a href="/sostenibilidad" className="enlace-footer">Sostenibilidad</a>
        </div>

        {/* Columna 2 */}
        <div className="columna-footer">
          <h3 className="titulo-footer">Ayuda</h3>
          <a href="/faq" className="enlace-footer">Preguntas frecuentes</a>
          <a href="/envio" className="enlace-footer">Información de envío</a>
          <a href="/terminos" className="enlace-footer">Términos de servicio</a>
          <a href="/devoluciones" className="enlace-footer">Política de devolución</a>
        </div>

        {/* Columna 3 */}
        <div className="columna-footer">
          <h3 className="titulo-footer">Conectar</h3>
          <div className="logos-footer">
            <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">
              <img src="/instagram.jpg" alt="Instagram" />
            </a>
            <a href="https://www.tiktok.com" target="_blank" rel="noopener noreferrer">
              <img src="/tiktok.jpg" alt="Tiktok" />
            </a>
            <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">
              <img src="/facebook.jpg" alt="Facebook" />
            </a>
            <a href="https://www.pinterest.com" target="_blank" rel="noopener noreferrer">
              <img src="/pinterest.jpg" alt="Pinterest" />
            </a>
          </div>
        </div>

        {/* Columna 4 */}
        <div className="columna-footer">
          <Link
            to="/"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <h1 className="logo-footer">Archives</h1>
          </Link>
          <p>
            Descubre nuestra cuidada selección de libros y artículos de papelería, pensados para inspirar, acompañar y hacer más especial cada momento.
            Encuentra desde historias que despiertan la imaginación hasta herramientas creativas que transforman tu día a día.
          </p>
        </div>

      </div>

      {/* Pie final */}
      <div className="footer-final">
        <p className="texto-final-footer">
          © 2026 Archives - Todos los derechos reservados. Desarrollado por Sara, Linda y Yesenia.
        </p>
      </div>
    </footer>
  );
}