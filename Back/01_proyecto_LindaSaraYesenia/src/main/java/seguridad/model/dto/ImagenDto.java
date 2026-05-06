package seguridad.model.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ImagenDto {
    private Integer idImagen;
    private String tipo;
    private String ruta;
}