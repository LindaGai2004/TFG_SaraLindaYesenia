package seguridad.service;

import java.io.ByteArrayOutputStream;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import org.thymeleaf.context.Context;
import org.thymeleaf.spring6.SpringTemplateEngine;

import com.openhtmltopdf.pdfboxout.PdfRendererBuilder;
import seguridad.model.Factura;
@Service
public class PdfServiceImpl implements PdfService{
	@Autowired
	private SpringTemplateEngine templateEngine;
	
	@Override
	public byte[] generarPdf(Factura factura) throws Exception{
		ByteArrayOutputStream baos = new ByteArrayOutputStream();
		//Contexto Thymeleaf
		Context context = new Context();
		context.setVariable("factura", factura);
		context.setVariable("usuario", factura.getPedido().getUsuario());
		//Procesar plantilla de HTML
		String html = templateEngine.process("factura", context);
		//Convertir HTML a PDF
		PdfRendererBuilder builder = new PdfRendererBuilder();
		builder.withHtmlContent(html, null);
		builder.toStream(baos);
		builder.run();
		return baos.toByteArray();
	}

}
