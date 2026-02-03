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
	@JoinColumn(name = "id_genero")
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

	public String getISBN() {
		return ISBN;
	}

	public void setISBN(String iSBN) {
		ISBN = iSBN;
	}

	public String getEditorial() {
		return editorial;
	}

	public void setEditorial(String editorial) {
		this.editorial = editorial;
	}

	public LocalDate getFechaPublicacion() {
		return fechaPublicacion;
	}

	public void setFechaPublicacion(LocalDate fechaPublicacion) {
		this.fechaPublicacion = fechaPublicacion;
	}

	public String getAutor() {
		return autor;
	}

	public void setAutor(String autor) {
		this.autor = autor;
	}

	public Integer getNumeroPagina() {
		return numeroPagina;
	}

	public void setNumeroPagina(Integer numeroPagina) {
		this.numeroPagina = numeroPagina;
	}

	public Genero getGenero() {
		return genero;
	}

	public void setGenero(Genero genero) {
		this.genero = genero;
	}

	public Idioma getIdioma() {
		return idioma;
	}

	public void setIdioma(Idioma idioma) {
		this.idioma = idioma;
	}

	public static long getSerialversionuid() {
		return serialVersionUID;
	}
	
	
	
	
}

