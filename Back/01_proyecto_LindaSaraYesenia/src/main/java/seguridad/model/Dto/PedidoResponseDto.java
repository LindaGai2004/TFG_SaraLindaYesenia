package seguridad.model.Dto;

import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import seguridad.model.EstadoPedido;
import seguridad.model.Pedido;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PedidoResponseDto {
	private Integer idPedido;
	private LocalDate fechaVenta;
	private EstadoPedido estado;
	private Double total;
	
    public PedidoResponseDto(Pedido pedido) {
        this.idPedido = pedido.getIdPedido();
        this.fechaVenta = pedido.getFechaVenta();
        this.estado = pedido.getEstado();
        this.total = pedido.getTotal();
    }
}
