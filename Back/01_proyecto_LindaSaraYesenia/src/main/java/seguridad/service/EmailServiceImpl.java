package seguridad.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;
import org.springframework.core.io.ByteArrayResource;

import jakarta.mail.internet.MimeMessage;
import seguridad.model.Factura;
@Service
public class EmailServiceImpl implements EmailService{

	@Autowired
	private JavaMailSender mailSender;
	@Autowired
	private TemplateEngine templateEngine;
	@Override
	public void enviarFacturaAdjunto(String to, Factura factura, byte[] pdf) 
			throws Exception{
		MimeMessage mensaje = mailSender.createMimeMessage();
		MimeMessageHelper helper = new MimeMessageHelper(mensaje, true, "UTF-8");
		//Contexto de Thymeleaf
		Context context = new Context();
		context.setVariable("factura", factura);
		context.setVariable("usuario",factura.getPedido().getUsuario());
		//Plantilla HTML
		String contenidoHtml = templateEngine.process("emailFactura", context);
		
		helper.setTo(to);
		helper.setSubject("Tu factura " + factura.getNumFactura());
		helper.setText(contenidoHtml, true);
		helper.addAttachment(factura.getNumFactura() + ".pdf", new ByteArrayResource(pdf));
		mailSender.send(mensaje);
	}

}
