package chatbot.dto;

import java.util.ArrayList;
import java.util.List;

import lombok.Data;

public class ChatResponse {
	
	private String respuesta;
	private boolean necesitaSoporte;
	private List<ProductoDto> productos;
	
    public ChatResponse(String respuesta) {
        this.respuesta = respuesta;
        this.necesitaSoporte = false;
        this.productos = new ArrayList<>();
    }
    public ChatResponse(String respuesta, boolean necesitaSoporte) {
        this.respuesta = respuesta;
        this.necesitaSoporte = necesitaSoporte;
        this.productos = new ArrayList<>();
    }
    public ChatResponse(String respuesta, List<ProductoDto>productos) {
        this.respuesta = respuesta;
        this.necesitaSoporte = false;
        this.productos = productos != null ? productos : new ArrayList<>();
    }
    
    public String getRespuesta() {
    	return respuesta;
    }
    public void setRespuesta(String respuesta) {
    	this.respuesta = respuesta;
    }
    public boolean isNecesitaSoporte() {
    	return necesitaSoporte;
    }
    public void setNecesitaSoporte(boolean necesitaSoporte) {
    	this.necesitaSoporte = necesitaSoporte;
    }
    public List<ProductoDto> getProductos(){
    	return productos;
    }
    public void setProductos(List<ProductoDto> productos) {
    	this.productos = productos;
    }
}
