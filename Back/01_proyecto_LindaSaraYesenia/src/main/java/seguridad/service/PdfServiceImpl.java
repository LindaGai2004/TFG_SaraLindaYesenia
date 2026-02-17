package seguridad.service;

import java.io.ByteArrayOutputStream;
import org.springframework.stereotype.Service;

import com.lowagie.text.Document;
import com.lowagie.text.Paragraph;
import com.lowagie.text.pdf.PdfWriter;

import seguridad.model.Factura;
import seguridad.model.Usuario;
@Service
public class PdfServiceImpl implements PdfService{

	@Override
	public byte[] generarPdf(Factura factura) throws Exception{
		ByteArrayOutputStream baos = new ByteArrayOutputStream();
		Document doc = new Document();
		PdfWriter.getInstance(doc, baos);
		Usuario u = factura.getPedido().getUsuario();
		doc.open();
		doc.add(new Paragraph("FACTURA"));
		doc.add(new Paragraph("Número: " + factura.getNumFactura()));
		doc.add(new Paragraph("Fecha " + factura.getFechaFactura()));
		doc.add(new Paragraph("Cliente: " + u.getNombre() + " " + u.getApellidos()));
		doc.add(new Paragraph("Email: " + u.getEmail()));
		doc.add(new Paragraph("Dirección: " + u.getDireccion()));
		doc.add(new Paragraph("Total: " + factura.getPrecioTotal() + " €"));
		doc.close();
		return baos.toByteArray();
	}

}
