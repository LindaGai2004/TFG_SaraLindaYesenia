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
@Data
@Builder
@Entity
@Table(name = "categoria_papeleria")
public class CategoriaPapeleria implements Serializable{
	private static final long serialVersionUID = 1L;
	@Id
	@Column(name = "id_papeleria")
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer idPapeleria;
	
	private String categoria;

	
	

}
