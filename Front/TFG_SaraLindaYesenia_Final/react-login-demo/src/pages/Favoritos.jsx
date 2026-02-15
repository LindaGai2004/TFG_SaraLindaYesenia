import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { imagenesLibros, imagenesPapeleria } from "../data/imagenes";

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
  }, [user.idUsuario]);

  // Eliminar favorito
  const removeFavorito = async (idProducto) => {
    try {
      await fetch(
        `http://localhost:9001/usuarios/${user.idUsuario}/favoritos/${idProducto}`,
        { method: "DELETE" }
      );

      setFavoritos(prev => prev.filter(f => f.idProducto !== idProducto));

    } catch (error) {
      console.error("Error eliminando favorito:", error);
    }
  };

  if (loading) {
    return <p style={{ padding: "20px" }}>Cargando favoritos...</p>;
  }

  return (
    <div className="favoritos-container" style={{ padding: "20px" }}>
      <h2 style={{ marginBottom: "20px" }}>Mis Favoritos</h2>

      {favoritos.length === 0 ? (
        <p>No tienes productos en favoritos todavía.</p>
      ) : (
        <div className="favoritos-lista" style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {favoritos.map(fav => {

            // RECONSTRUIR IMAGEN SEGÚN TIPO
            let imagen = "";

            if (fav.tipo_producto === "LIBRO") {
              imagen = imagenesLibros[fav.idProducto]?.portada;
            }

            if (fav.tipo_producto === "PAPELERIA") {
              imagen = imagenesPapeleria[fav.idProducto];
            }

            return (
              <div 
                key={fav.idProducto}
                className="favorito-card"
                style={{
                  display: "flex",
                  background: "#fff",
                  borderRadius: "12px",
                  padding: "15px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                  alignItems: "center",
                  gap: "20px"
                }}
              >
                {/* COLUMNA IZQUIERDA: IMAGEN */}
                <div style={{ width: "120px", height: "160px", overflow: "hidden", borderRadius: "8px" }}>
                  <img 
                    src={imagen}
                    alt={fav.nombreProducto}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                </div>

                {/* COLUMNA DERECHA */}
                <div style={{ flex: 1 }}>
                  <h3 style={{ margin: "0 0 5px 0" }}>{fav.nombreProducto}</h3>

                  <p style={{ margin: "0 0 10px 0", color: "#555" }}>
                    {fav.tipo_producto === "LIBRO"
                      ? fav.autor || "Autor desconocido"
                      : fav.marca?.nombreMarca || "Marca desconocida"}
                  </p>

                  <p style={{ fontWeight: "bold", marginBottom: "15px" }}>
                    {fav.precio} €
                  </p>

                  {/* BOTONES */}
                  <div style={{ display: "flex", gap: "10px" }}>
                    <button
                      style={{
                        background: "#007bff",
                        color: "white",
                        border: "none",
                        padding: "8px 12px",
                        borderRadius: "6px",
                        cursor: "pointer"
                      }}
                    >
                      Añadir al carrito
                    </button>

                    <button
                      onClick={() => removeFavorito(fav.idProducto)}
                      style={{
                        background: "#ff4d4d",
                        color: "white",
                        border: "none",
                        padding: "8px 12px",
                        borderRadius: "6px",
                        cursor: "pointer"
                      }}
                    >
                      Eliminar de favoritos
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}