package chatbot.service;

import chatbot.dto.ChatRequest;
import chatbot.dto.ChatResponse;

public interface ChatService {
	ChatResponse chat(ChatRequest request);
}
