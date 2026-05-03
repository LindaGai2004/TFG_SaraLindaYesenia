package seguridad.model.dto;

import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class FiltroProductoDto {

	private String tipo; 
	private String idioma; 
	private String genero; 
	private String marca; 
	private String categoria; 
	private Double precio; 
	private String estado;

	
}
