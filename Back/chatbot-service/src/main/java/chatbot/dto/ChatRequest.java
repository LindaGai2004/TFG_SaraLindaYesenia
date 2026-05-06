package chatbot.dto;

import java.util.List;
import java.util.Map;

public class ChatRequest {
	private String mensaje;
	private List<Map<String, String>> historial;
	public String getMensaje() {
		return mensaje;
	}
	
	public void setMensaje(String mensaje) {
		this.mensaje = mensaje;
	}
	public List<Map<String, String>> getHistorial(){
		return historial;
	}
	public void setHistorial(List<Map<String, String>> historial)
	{this.historial=historial;}
}
