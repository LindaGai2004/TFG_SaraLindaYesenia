package seguridad.model;

import java.io.Serializable;
import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@NoArgsConstructor
@Entity
@ToString(callSuper = true)
@Getter
@Setter
@DiscriminatorValue("PAPELERIA")
@Table(name = "papeleria")
public class Papeleria extends Producto implements Serializable {
	private static final long serialVersionUID = 1L;

	@ManyToOne
	@JoinColumn(name = "id_marca")
	private Marca marca;
	
	@ManyToOne
	@JoinColumn (name = "id_categoria")
	private Categoria categoria;

	public Papeleria(Integer idProducto, String nombreProducto, String descripcion, Double precio, Integer stock,
			EstadoProducto estadoProducto, LocalDate fechaAlta, Double costoReal, Marca marca, Categoria categoria) {
		super(idProducto, nombreProducto, descripcion, precio, stock, estadoProducto, fechaAlta, costoReal);
		this.marca = marca;
		this.categoria = categoria;
	}
}
