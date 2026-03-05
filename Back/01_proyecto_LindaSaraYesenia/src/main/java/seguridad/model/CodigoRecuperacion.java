package seguridad.model;

import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Entity
@Data
public class CodigoRecuperacion {

    @Id
    private String email;

    private String codigo;

    private LocalDateTime expiracion;
}
