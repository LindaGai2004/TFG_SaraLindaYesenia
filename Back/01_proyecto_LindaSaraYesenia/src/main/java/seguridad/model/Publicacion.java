package seguridad.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Entity
@Table(name = "publicaciones")
public class Publicacion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_publicacion")
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "id_usuario", nullable = false)
    private Usuario usuario;
    
    @ManyToOne
    @JoinColumn(name = "id_producto", nullable = true)
    // nullable = true porque no todas las publicaciones tienen libro
    private Producto producto;
    
    @Column(columnDefinition = "TEXT")
    private String texto;

    private String imagen;

    private LocalDateTime fecha;

    private Integer likes;

    private Integer comentarios;

    @PrePersist
    /* ejecuta un método justo antes de guardar un registro en la base de datos por primera vez */
    public void prePersist() {
        this.fecha = LocalDateTime.now();
        if (this.likes == null) this.likes = 0;
        if (this.comentarios == null) this.comentarios = 0;
    }
}