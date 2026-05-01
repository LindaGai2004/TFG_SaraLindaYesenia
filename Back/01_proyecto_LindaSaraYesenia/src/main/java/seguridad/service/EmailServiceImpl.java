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

	
	@Override
	public void enviarCodigoRecuperacion(String to, String codigo) throws Exception {
	    MimeMessage mensaje = mailSender.createMimeMessage();
	    MimeMessageHelper helper = new MimeMessageHelper(mensaje, false, "UTF-8");

	    String texto = 
	        "Hola,\n\n" +
	        "Hemos recibido una solicitud para restablecer tu contraseña.\n\n" +
	        "Tu código de recuperación es: " + codigo + "\n\n" +
	        "Este código es válido durante 1 minuto.\n\n" +
	        "Si no solicitaste este cambio, puedes ignorar este mensaje.";

	    helper.setTo(to);
	    helper.setSubject("Código de recuperación de contraseña");
	    helper.setText(texto, false);

	    mailSender.send(mensaje);
	}


	@Override
	public void enviarEmailSimple(String to, String asunto, String mensaje) throws Exception {
	    MimeMessage email = mailSender.createMimeMessage();
	    MimeMessageHelper helper = new MimeMessageHelper(email, false, "UTF-8");

	    helper.setTo(to);
	    helper.setSubject(asunto);
	    helper.setText(mensaje, false);

	    mailSender.send(email);
	}
}
