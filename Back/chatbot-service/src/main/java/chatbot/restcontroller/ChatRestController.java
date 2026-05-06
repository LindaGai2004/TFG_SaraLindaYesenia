package chatbot.restcontroller;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import chatbot.dto.ChatRequest;
import chatbot.dto.ChatResponse;
import chatbot.service.ChatService;

@RestController
@RequestMapping("/chat")
@CrossOrigin(origins="*")
public class ChatRestController {
	private final ChatService chatService;
	public ChatRestController(ChatService chatService) {
		this.chatService = chatService;
	}
	@PostMapping
	public ChatResponse chat (@RequestBody ChatRequest request){
		return chatService.chat(request);
	}
}
