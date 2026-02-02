package seguridad.model.dto;

import java.time.LocalDate;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import seguridad.model.Factura;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
class FacturaDto {
	private Integer idFactura;
	private String numFactura;
	private LocalDate fechaFactura;
	private Double precioTotal;
	private Integer idPedido;

	public FacturaDto(Factura factura) {
		this.idFactura = factura.getIdFactura();
		this.numFactura = factura.getNumFactura();
		this.fechaFactura = factura.getFechaFactura();
		this.precioTotal = factura.getPrecioTotal();
		this.idPedido = factura.getPedido().getIdPedido();
	}
}
