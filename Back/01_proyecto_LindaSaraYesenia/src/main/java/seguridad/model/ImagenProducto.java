package seguridad.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.Enumerated;
import jakarta.persistence.EnumType;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@AllArgsConstructor 
@NoArgsConstructor 
@Data
@Table(name = "imagenes_producto")
public class ImagenProducto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idImagen;

    @ManyToOne
    @JoinColumn(name = "id_producto")
    @JsonIgnoreProperties("imagenes") // Sirve para evitar que Spring entre en un bucle infinito cuando convierte las entidades a JSON
    private Producto producto;

    @Enumerated(EnumType.STRING)
    private TipoImagen tipo;

    private String ruta;
}