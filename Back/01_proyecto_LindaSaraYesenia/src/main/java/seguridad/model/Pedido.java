package seguridad.model;

import java.io.Serializable;
import java.sql.Date;
import java.time.LocalDate;
import java.util.List;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
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
@Table(name = "PEDIDOS")
public class Pedido implements Serializable{
	private static final long serialVersionUID = 1L;
	@Id
	@Column(name = "id_pedido")
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int idPedido;
	
	@Column(name = "fecha_venta")
	private LocalDate fechaVenta;
	
	 @Enumerated(EnumType.STRING)
	 @Column(name = "estado_pedido")
	 private EstadoPedido estado;
	
	//Esto es nuevo
	@Column(name="total")
	private Double total;
	
	@ManyToOne
	@JoinColumn(name = "id_usuario")
	private Usuario usuario;
	
	//Esto no se aunpreguntar)
	//@OneToMany(mappedBy = "pedido")
	//private List<DetallePedido> detalles;
	
}
