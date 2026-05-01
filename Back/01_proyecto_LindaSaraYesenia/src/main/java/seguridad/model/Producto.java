package seguridad.model;

import java.io.Serializable;
import java.time.LocalDate;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.Column;
import jakarta.persistence.DiscriminatorColumn;
import jakarta.persistence.DiscriminatorType;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Inheritance;
import jakarta.persistence.InheritanceType;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.ToString;
@AllArgsConstructor
@NoArgsConstructor
@Data
@EqualsAndHashCode(of = "idProducto")
@Entity
@ToString(exclude = "imagenes")
@DiscriminatorColumn(name = "tipo_producto", discriminatorType = DiscriminatorType.STRING)
@Inheritance(strategy = InheritanceType.JOINED)
@Table(name = "productos")

public abstract class Producto implements Serializable{
	
	private static final long serialVersionUID = 1L;

	@Id
	@Column(name = "id_producto")
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer idProducto;
	
	@Column(name = "nombre_producto")
	private String nombreProducto;
	
	private String descripcion;
	
	private Double precio;
	private Integer stock;
	
	@Enumerated(EnumType.STRING)
	@Column(name = "estado_producto")
	private EstadoProducto estadoProducto;
	
	@Column(name = "fecha_alta")
	private LocalDate fechaAlta;
	@Column(name = "costo_real")
	private Double costoReal;
	@Column(nullable = false)
	boolean destacado; 

	@OneToMany(mappedBy = "producto")
	@JsonIgnoreProperties("producto") //evita bucles infinitos al convertir a JSON.
	private List<ImagenProducto> imagenes;

	
	public Producto(Integer idProducto, String nombreProducto, String descripcion, Double precio, Integer stock,
			EstadoProducto estadoProducto, LocalDate fechaAlta, Double costoReal) {
		super();
		this.idProducto = idProducto;
		this.nombreProducto = nombreProducto;
		this.descripcion = descripcion;
		this.precio = precio;
		this.stock = stock;
		this.estadoProducto = estadoProducto;
		this.fechaAlta = fechaAlta;
		this.costoReal = costoReal;
	}
}
