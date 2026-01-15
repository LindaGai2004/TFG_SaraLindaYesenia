package seguridad.model;

import java.awt.TextArea;
import java.io.Serializable;
import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
@Entity
@Table(name = "PRODUCTOS")

public class Producto implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@Column(name = "id_producto")
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer idProducto;
	@Column(name = "nombre_libro")
	private String nombreLibro;
	private String descripcion;
	@Enumerated(EnumType.STRING)
	@Column(name = "tipo_producto")
	private TipoProducto tipoProducto;
	private Double precio;
	private Integer stock;
	private String estado;
	@Column(name = "fecha_alta")
	private LocalDate fechaAlta;
	@Column(name = "costo_real")
	private Double costoReal;
	
	@ManyToOne
	@JoinColumn(name = "id_categoria_papeleria")
	private CategoriaPapeleria categoriaPapeleria;


	public Integer getIdProducto() {
		return idProducto;
	}

	public void setIdProducto(Integer idProducto) {
		this.idProducto = idProducto;
	}

	public String getNombreLibro() {
		return nombreLibro;
	}

	public void setNombreLibro(String nombreLibro) {
		this.nombreLibro = nombreLibro;
	}

	public String getDescripcion() {
		return descripcion;
	}

	public void setDescripcion(String descripcion) {
		this.descripcion = descripcion;
	}

	public TipoProducto getTipoProducto() {
		return tipoProducto;
	}

	public void setTipoProducto(TipoProducto tipoProducto) {
		this.tipoProducto = tipoProducto;
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

	public String getEstado() {
		return estado;
	}

	public void setEstado(String estado) {
		this.estado = estado;
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

	public CategoriaPapeleria getCategoriaPapeleria() {
		return categoriaPapeleria;
	}

	public void setCategoriaPapeleria(CategoriaPapeleria categoriaPapeleria) {
		this.categoriaPapeleria = categoriaPapeleria;
	}

	public CategoriaLibro getCategoriaLibro() {
		return categoriaLibro;
	}

	public void setCategoriaLibro(CategoriaLibro categoriaLibro) {
		this.categoriaLibro = categoriaLibro;
	}

	public static long getSerialversionuid() {
		return serialVersionUID;
	}
	
	
	
}
