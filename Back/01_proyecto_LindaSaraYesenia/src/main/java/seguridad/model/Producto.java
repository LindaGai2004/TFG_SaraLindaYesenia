package seguridad.model;

import java.io.Serializable;
import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.DiscriminatorColumn;
import jakarta.persistence.DiscriminatorType;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
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
	
	@Enumerated(EnumType.STRING)
	@Column(name = "estado_producto")
	private EstadoProducto estadoProducto;
	
	@Column(name = "fecha_alta")
	private LocalDate fechaAlta;
	@Column(name = "costo_real")
	private Double costoReal;
	@Column(nullable = false)
	boolean destacado; //para libro del mes 

	
	public Integer getIdProducto() {
		return idProducto;
	}

	public void setIdProducto(Integer idProducto) {
		this.idProducto = idProducto;
	}

	public String getNombreProducto() {
		return nombreProducto;
	}

	public void setNombreProducto(String nombreProducto) {
		this.nombreProducto = nombreProducto;
	}

	public String getDescripcion() {
		return descripcion;
	}

	public void setDescripcion(String descripcion) {
		this.descripcion = descripcion;
	}

	public Double getPrecio() {
		return precio;
	}

	public void setPrecio(Double precio) {
		this.precio = precio;
	}

	public Integer getStock() {
		return stock;
	}

	public void setStock(Integer stock) {
		this.stock = stock;
	}

	public EstadoProducto getEstadoProducto() {
		return estadoProducto;
	}

	public void setEstadoProducto(EstadoProducto estadoProducto) {
		this.estadoProducto = estadoProducto;
	}

	public LocalDate getFechaAlta() {
		return fechaAlta;
	}

	public void setFechaAlta(LocalDate fechaAlta) {
		this.fechaAlta = fechaAlta;
	}

	public Double getCostoReal() {
		return costoReal;
	}

	public void setCostoReal(Double costoReal) {
		this.costoReal = costoReal;
	}

	public static long getSerialversionuid() {
		return serialVersionUID;
	}

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
