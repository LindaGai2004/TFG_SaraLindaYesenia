package seguridad.model;

import java.io.Serializable;
import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
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
@Table(name = "detalle_libro")
public class DetalleLibro implements Serializable {
	
	private static final long serialVersionUID = 1L;
	@Id
	@Column(name = "id_producto")
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer idProducto;
	
	private Long ISBN;
	private String idioma;
	private String editorial;
	@Column(name = "fecha_publicacion")
	private LocalDate fechaPublicacion;
	
	private String autor;
	@Column(name = "numero_paginas")
	private Integer numeroPagina;
	
	@ManyToOne
	@JoinColumn(name = "id_producto")
	private Producto producto;

	
	@ManyToOne
	@JoinColumn(name = "id_libro")
	private CategoriaLibro categoriaLibro;
}
