package seguridad.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.springframework.core.io.ByteArrayResource;

import jakarta.mail.internet.MimeMessage;
import seguridad.model.Factura;
@Service
public class EmailServiceImpl implements EmailService{

	@Autowired
	private JavaMailSender mailSender;
	
	@Override
	public void enviarFacturaAdjunto(String to, Factura factura, byte[] pdf) 
			throws Exception{
		MimeMessage mensaje = mailSender.createMimeMessage();
		MimeMessageHelper helper = new MimeMessageHelper(mensaje, true);
		helper.setTo(to);
		helper.setSubject("Tu factura " + factura.getNumFactura());
		helper.setText("Gracias por tu compra. Adjuntamos tu factura");
		
		helper.addAttachment(factura.getNumFactura() + ".pdf", new ByteArrayResource(pdf));
		mailSender.send(mensaje);
	}

}
