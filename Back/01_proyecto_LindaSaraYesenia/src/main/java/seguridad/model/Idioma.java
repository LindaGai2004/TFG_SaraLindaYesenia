package seguridad.model;

import java.io.Serializable;

import org.springframework.data.annotation.Id;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
@AllArgsConstructor
@NoArgsConstructor
@Entity @Data @Builder
@Table(name = "idioma")
public class Idioma implements Serializable{
	
	private static final long serialVersionUID = 1L;
	
	@Id
	@Column(name = "id_idioma")
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int idIdioma;
	
	@Column(name = "idioma_libro")
	private String idiomaLibro;

}
