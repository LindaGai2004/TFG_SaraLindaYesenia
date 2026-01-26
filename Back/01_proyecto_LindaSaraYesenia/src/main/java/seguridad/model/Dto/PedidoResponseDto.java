package seguridad.model.Dto;

import java.time.LocalDate;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import seguridad.model.EstadoPedido;
import seguridad.model.Pedido;

@Data
@AllArgsConstructor
@NoArgsConstructor
//La página de resume necesita data de pedido y de sus productos
public class PedidoResponseDto {
	private Integer idPedido;
	private LocalDate fechaVenta;
	private EstadoPedido estado;
	
	private Double subtotal;
	private Double iva;
	private Double total;
	
	private UsuarioDto usuario;
	private List<PedidoItemResponseDto> items;
	
	 public static PedidoResponseDto from(
	            Pedido pedido,
	            Double subtotal,
	            Double ivaTotal,
	            List<PedidoItemResponseDto> items
	    ) {
	        return PedidoResponseDto.builder()
	                .idPedido(pedido.getIdPedido())
	                .fechaVenta(pedido.getFechaVenta())
	                .estado(pedido.getEstado())
	                .subtotal(subtotal)
	                .ivaTotal(ivaTotal)
	                .total(pedido.getTotal())
	                .usuario(new UsuarioDto(pedido.getUsuario()))
	                .items(items)
	                .build();
	    }
}
