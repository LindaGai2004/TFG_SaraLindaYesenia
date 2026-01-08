package seguridad.model;

import java.io.Serializable;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Entity @Data @Builder
@Table(name = "categoria_libro")
public class CategoriaLibro implements Serializable {
	
	private static final long serialVersionUID = 1L;

	@Id
	@Column(name = "id_categoria_libro")
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer idCategoriaLibro;
	
	@Column(name = "genero_libro")
	private String generoLibro;

	public Integer getIdCategoriaLibro() {
		return idCategoriaLibro;
	}

	public void setIdCategoriaLibro(Integer idCategoriaLibro) {
		this.idCategoriaLibro = idCategoriaLibro;
	}

	public String getGeneroLibro() {
		return generoLibro;
	}

	public void setGeneroLibro(String generoLibro) {
		this.generoLibro = generoLibro;
	}

	public static long getSerialversionuid() {
		return serialVersionUID;
	}
	
	
}
