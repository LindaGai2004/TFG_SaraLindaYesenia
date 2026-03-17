package chatbot.configs;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestTemplate;
//permite que el chatbot llame a otros APIs
@Configuration
public class RestConfig {
	@Bean
	public RestTemplate restTemplate() {
		return new RestTemplate();
	}
}
