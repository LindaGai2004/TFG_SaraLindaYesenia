import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";

export default function Favoritos() {
  const { user } = useAuth();
  const [favoritos, setFavoritos] = useState([]);
  const [loading, setLoading] = useState(true);

  // Cargar favoritos del backend
  useEffect(() => {
    const fetchFavoritos = async () => {
      try {
        const res = await fetch(`http://localhost:9001/usuarios/${user.idUsuario}/favoritos`);

        const data = await res.json();
        setFavoritos(data);
      } catch (error) {
        console.error("Error cargando favoritos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFavoritos();
  }, [user.id]);

  // Eliminar favorito
  const removeFavorito = async (idProducto) => {
    try {
      await fetch(
        `http://localhost:9001/clientes/${user.id}/favoritos/${idProducto}`,
        { method: "DELETE" }
      );

      // Actualizar lista en pantalla
      setFavoritos(prev => prev.filter(f => f.id !== idProducto));
    } catch (error) {
      console.error("Error eliminando favorito:", error);
    }
  };

  if (loading) {
    return <p style={{ padding: "20px" }}>Cargando favoritos...</p>;
  }

  return (
    <div className="favoritos-container" style={{ padding: "20px" }}>
      <h2 style={{ marginBottom: "15px" }}>Mis Favoritos</h2>

      {favoritos.length === 0 ? (
        <p>No tienes productos en favoritos todavía.</p>
      ) : (
        <div className="favoritos-grid" style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
          gap: "20px"
        }}>
          {favoritos.map(fav => (
            <div 
              key={fav.id} 
              className="favorito-card"
              style={{
                background: "#fff",
                borderRadius: "10px",
                padding: "10px",
                boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                textAlign: "center"
              }}
            >
              <img 
                src={fav.imagen || "/placeholder.png"} 
                alt={fav.nombre} 
                style={{ width: "100%", borderRadius: "8px" }}
              />

              <p style={{ marginTop: "10px", fontWeight: "bold" }}>{fav.nombre}</p>

              <button 
                onClick={() => removeFavorito(fav.id)}
                style={{
                  marginTop: "10px",
                  background: "#ff4d4d",
                  color: "white",
                  border: "none",
                  padding: "6px 10px",
                  borderRadius: "6px",
                  cursor: "pointer"
                }}
              >
                Quitar
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
