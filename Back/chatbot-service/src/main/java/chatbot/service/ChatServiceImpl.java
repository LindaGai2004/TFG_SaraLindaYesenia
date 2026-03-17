package chatbot.service;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import chatbot.dto.ChatRequest;
import chatbot.dto.ChatResponse;
@Service
public class ChatServiceImpl implements ChatService {
	private final RestTemplate restTemplate;
	public ChatServiceImpl(RestTemplate restTemplate) {
		this.restTemplate = restTemplate;
	}
	
	@Override
	public ChatResponse chat(ChatRequest request) {
		String mensaje = request.getMensaje();
		String url = "http://localhost:9001/libros/todos";
		String resultado = restTemplate.getForObject(url, String.class);
		return new ChatResponse("Mensaje recibido: " + mensaje + ". Backend respondio correctamente");
		//por ahora se obtiene solo json
	}
	
}
