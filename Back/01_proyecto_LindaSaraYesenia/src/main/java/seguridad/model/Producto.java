package seguridad.model;


import java.io.Serializable;
import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.DiscriminatorColumn;
import jakarta.persistence.DiscriminatorType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Inheritance;
import jakarta.persistence.InheritanceType;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@Data
@EqualsAndHashCode(of = "idProducto")
@Entity
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
	private String estado;
	@Column(name = "fecha_alta")
	private LocalDate fechaAlta;
	@Column(name = "costo_real")
	private Double costoReal;
	
	
	public Producto(String nombreProducto, String descripcion, Double precio, Integer stock, String estado,
			LocalDate fechaAlta, Double costoReal) {
		super();
		this.nombreProducto = nombreProducto;
		this.descripcion = descripcion;
		this.precio = precio;
		this.stock = stock;
		this.estado = estado;
		this.fechaAlta = fechaAlta;
		this.costoReal = costoReal;
	}
	
	
	
	
	
}
