package chatbot.dto;

import java.util.List;

import lombok.Data;

@Data
public class ProductoDto {
	private Integer idProducto;
    private String nombreProducto;
    private String tipoProducto;
    private Double precio;
    private String estadoProducto;
    private String autor;
    private String genero;
    private String idioma;
    private String categoria;
    private String imagenUrl;
}
