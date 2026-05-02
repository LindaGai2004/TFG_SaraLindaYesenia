package seguridad.model.dto;
import lombok.AllArgsConstructor;
import lombok.Data;
@Data
@AllArgsConstructor
public class SeguidorDto {
	
	private Integer idUsuario;
	private String nombre;
	private String apellidos;
	private String username;
	private String email;
	private String avatar;
	private boolean siguiendo;

}
