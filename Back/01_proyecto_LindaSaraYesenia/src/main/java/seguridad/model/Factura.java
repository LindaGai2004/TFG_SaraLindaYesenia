package seguridad.model;

import java.io.Serializable;
import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
@AllArgsConstructor
@NoArgsConstructor
@ToString
@Getter
@Setter
@Entity
@Table(name="facturas")
public class Factura implements Serializable{

	private static final long serialVersionUID = 1L;
	@Id
	@Column(name="id_factura")
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer idFactura;
	@Column(name ="num_factura")
	private String numFactura;
	@Column(name = "fecha_factura")
	private LocalDate fechaFactura;
	@Column(name= "precio_total")
	private Double precioTotal;
	@ManyToOne
	@JoinColumn(name="id_pedido")
	private Pedido pedido;
}