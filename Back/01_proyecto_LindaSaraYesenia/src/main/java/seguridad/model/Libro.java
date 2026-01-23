package seguridad.model;

import java.io.Serializable;
import java.time.LocalDate;
import java.util.jar.Attributes.Name;

import jakarta.persistence.Column;
import jakarta.persistence.DiscriminatorColumn;
import jakarta.persistence.DiscriminatorValue;
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
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@NoArgsConstructor
@Getter
@Setter
@ToString(callSuper = true)
@Entity
@DiscriminatorValue("LIBRO")
@Table(name = "libros")
public class Libro extends Producto implements Serializable{
	
	private static final long serialVersionUID = 1L;

	
	private String ISBN;
	
	private String editorial;
	
	@Column(name = "fecha_publicacion")
	private LocalDate fechaPublicacion;
	
	private String autor;
	@Column(name = "numero_paginas")
	private Integer numeroPagina;
	
	@ManyToOne
	@JoinColumn(name = "id_libro")
	private Genero genero;
	
	@ManyToOne
	@JoinColumn(name = "id_idioma")
	private Idioma idioma;

	public Libro(Integer idProducto, String nombreProducto, String descripcion, Double precio, Integer stock,
			EstadoProducto estadoProducto, LocalDate fechaAlta, Double costoReal, String iSBN, String editorial,
			LocalDate fechaPublicacion, String autor, Integer numeroPagina, Genero genero, Idioma idioma) {
		super(idProducto, nombreProducto, descripcion, precio, stock, estadoProducto, fechaAlta, costoReal);
		ISBN = iSBN;
		this.editorial = editorial;
		this.fechaPublicacion = fechaPublicacion;
		this.autor = autor;
		this.numeroPagina = numeroPagina;
		this.genero = genero;
		this.idioma = idioma;
	}

	
	






	
}

