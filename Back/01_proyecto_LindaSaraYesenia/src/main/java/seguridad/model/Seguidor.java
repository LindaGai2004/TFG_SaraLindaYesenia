package seguridad.model;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;

@Data
@Entity
@Table(name = "seguidores")
public class Seguidor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    // El usuario que pulsa el botón "seguir"
    @ManyToOne
    @JoinColumn(name = "id_seguidor", nullable = false)
    private Usuario seguidor;

    // El usuario que es seguido
    @ManyToOne
    @JoinColumn(name = "id_seguido", nullable = false)
    private Usuario seguido;

    @Column(name = "fecha_seguimiento")
    private LocalDateTime fechaSeguimiento;

    // Constructor necesario para JPA
    public Seguidor() {
        this.fechaSeguimiento = LocalDateTime.now();
    }
}