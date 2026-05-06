package seguridad.model.dto;

import lombok.Data;
import seguridad.model.Libro;
import seguridad.model.Papeleria;
import seguridad.model.TipoImagen;

//dto para juntar libro y papeleria en un solo objeto para el chatbot
@Data
public class ProductoChatbotDto {
	private String nombreProducto;
	private String tipoProducto;
	private Double precio;
	private String estadoProducto;
	private String descripcion;
	private String descripcionLarga;
	private String autor; //solo para libros, null en papeleria
	private String genero; //solo para libros, null en papeleria
	private String idioma; //solo para libros, null en papeleria
	private String categoria; //solo para papeleria, null en libros
	private String imagenUrl; //ruta de la img principal
	private Integer idProducto;
	//para libro
	public ProductoChatbotDto(Libro l) {
		this.nombreProducto = l.getNombreProducto();
		this.tipoProducto = "LIBRO";
		this.precio = l.getPrecio();
		this.estadoProducto = l.getEstadoProducto().name();
		this.descripcion = l.getDescripcion();
		this.descripcionLarga = l.getResumen();
		this.autor = l.getAutor();
		this.genero = l.getGenero() != null ? l.getGenero().getNombreGenero() : null;
		this.idioma = l.getIdioma() != null ? l.getIdioma().getNombreIdioma() : null;
		this.categoria = null;
		// Busca la imagen de tipo PRINCIPAL, si no hay coge la primera
	    this.imagenUrl = l.getImagenes() != null ? l.getImagenes().stream()
	    	    .filter(img -> TipoImagen.PRINCIPAL.equals(img.getTipo()))
	    	    .map(img -> "uploads/" + img.getRuta())
	    	    .findFirst()
	    	    .orElse(null) : null;
	    this.idProducto = l.getIdProducto();
	}
	//para papeleria
	public ProductoChatbotDto(Papeleria p) {
		this.nombreProducto = p.getNombreProducto();
		this.tipoProducto = "PAPELERIA";
		this.precio = p.getPrecio();
		this.estadoProducto = p.getEstadoProducto().name();
		this.descripcion = p.getDescripcion();
		this.descripcionLarga = p.getDescripcionLarga();
		this.autor = null;
		this.genero = null;
		this.idioma = null;
		this.categoria = p.getCategoria() != null ? p.getCategoria().getNombreCategoria() : null;
		this.imagenUrl = p.getImagenes() != null ? p.getImagenes().stream()
			    .filter(img -> TipoImagen.PRINCIPAL.equals(img.getTipo()))
			    .map(img -> "uploads/" + img.getRuta())
			    .findFirst()
			    .orElse(null) : null;
		this.idProducto = p.getIdProducto();
	}
	

	
	
}
