package seguridad.security.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.paypal.core.PayPalEnvironment;
import com.paypal.core.PayPalHttpClient;

@Configuration
public class PaypalConfig {
	@Value("${paypal.client.id}")
	private String idCliente;
	@Value("${paypal.client.secret}")
	private String secretCliente;
	@Bean
	public PayPalHttpClient paypalHttpClient() {
		PayPalEnvironment environment = new PayPalEnvironment.Sandbox(idCliente, secretCliente);
		return new PayPalHttpClient(environment);
	}
}
