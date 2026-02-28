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
@Table(name = "marca")
public class Marca implements Serializable {
	private static final long serialVersionUID = 1L;
	@Id
	@Column(name = "id_marca")
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int idMarca;
	
	@Column(name = "nombre_marca")
	private String nombreMarca;

	public int getIdMarca() {
		return idMarca;
	}

	public void setIdMarca(int idMarca) {
		this.idMarca = idMarca;
	}

	public String getNombreMarca() {
		return nombreMarca;
	}

	public void setNombreMarca(String nombreMarca) {
		this.nombreMarca = nombreMarca;
	}

	public static long getSerialversionuid() {
		return serialVersionUID;
	}
	
	
}
