package seguridad.service;

import java.io.ByteArrayOutputStream;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import org.thymeleaf.context.Context;
import org.thymeleaf.spring6.SpringTemplateEngine;

import com.openhtmltopdf.pdfboxout.PdfRendererBuilder;

import seguridad.model.DetallePedido;
import seguridad.model.Factura;
import seguridad.model.Libro;
import seguridad.repository.DetallePedidoRepository;

import java.io.File;
import java.io.InputStream;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
@Service
public class PdfServiceImpl implements PdfService{
	@Autowired
	private SpringTemplateEngine templateEngine;
	@Autowired
    private DetallePedidoRepository dprepo;

    private static final BigDecimal IVA_LIBRO      = BigDecimal.valueOf(0.04);
    private static final BigDecimal IVA_PAPELERIA  = BigDecimal.valueOf(0.21);
    private static final BigDecimal DELIVERY       = BigDecimal.valueOf(2.00);

	
    @Override
    public byte[] generarPdf(Factura factura) throws Exception {

        List<DetallePedido> detalles =
                dprepo.findByPedido_IdPedido(factura.getPedido().getIdPedido());

        BigDecimal subtotal = BigDecimal.ZERO;
        BigDecimal ivaTotal = BigDecimal.ZERO;

        for (DetallePedido d : detalles) {
            BigDecimal precioUnidad  = BigDecimal.valueOf(d.getPrecioUnidad());
            BigDecimal cantidad      = BigDecimal.valueOf(d.getCantidad());
            BigDecimal totalPorItem  = precioUnidad.multiply(cantidad);
            subtotal = subtotal.add(totalPorItem);
            BigDecimal iva = (d.getProducto() instanceof Libro)
                    ? totalPorItem.multiply(IVA_LIBRO)
                    : totalPorItem.multiply(IVA_PAPELERIA);
            ivaTotal = ivaTotal.add(iva);
        }

        subtotal = subtotal.setScale(2, RoundingMode.HALF_UP);
        ivaTotal = ivaTotal.setScale(2, RoundingMode.HALF_UP);

        String logoBase64 = "";
        try (InputStream logoStream = getClass().getClassLoader()
                .getResourceAsStream("static/images/logo.png")) {
            if (logoStream != null) {
                byte[] logoBytes = logoStream.readAllBytes();
                logoBase64 = "data:image/png;base64," +
                    java.util.Base64.getEncoder().encodeToString(logoBytes);
            }
        } catch (Exception e) {
        }

        Context context = new Context();
        context.setVariable("factura",    factura);
        context.setVariable("usuario",    factura.getPedido().getUsuario());
        context.setVariable("subtotal",   subtotal);
        context.setVariable("iva",        ivaTotal);
        context.setVariable("delivery",   DELIVERY);
        context.setVariable("detalles",   detalles);
        context.setVariable("logoBase64", logoBase64); 

        String html = templateEngine.process("factura", context);

        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        PdfRendererBuilder builder = new PdfRendererBuilder();

        try (InputStream fontStream = getClass().getClassLoader()
                .getResourceAsStream("Fonts/Cormorant-Regular.ttf")) {
            if (fontStream != null) {
                byte[] fontBytes = fontStream.readAllBytes();
                builder.useFont(() -> new java.io.ByteArrayInputStream(fontBytes), "Cormorant");
            }
        }

        builder.withHtmlContent(html, null);
        builder.toStream(baos);
        builder.run();

        return baos.toByteArray();
    }
}
