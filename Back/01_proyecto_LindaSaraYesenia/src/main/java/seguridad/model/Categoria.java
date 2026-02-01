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
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
@EqualsAndHashCode(of = "idPapeleria")
@Entity
@Table(name = "categoria")
public class Categoria implements Serializable{
	
	private static final long serialVersionUID = 1L;
	@Id
	@Column(name = "id_categoria")
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer idCategoria;
	
	@Column(name = "nombre_categoria")
	private String nombreCategoria;

	
	

}
