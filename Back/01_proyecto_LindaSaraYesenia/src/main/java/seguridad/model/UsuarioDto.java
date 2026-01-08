package seguridad.model;

import java.time.LocalDate;

import jakarta.persistence.Entity;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data @Builder
public class UsuarioDto {
	private String username;
	private String nombre;
	private String apellidos;
	private String direccion;
	private String email;
	private LocalDate fechaRegistro;
	
public UsuarioDto(Usuario usuario) {
	this.username = usuario.getUsername();
	this.nombre = usuario.getNombre();
	this.apellidos = usuario.getApellidos();
	this.direccion = usuario.getDireccion();
	this.email = usuario.getEmail();
	this.fechaRegistro = usuario.getFechaRegistro();
	
}

public String getUsername() {
	return username;
}

public void setUsername(String username) {
	this.username = username;
}

public String getNombre() {
	return nombre;
}

public void setNombre(String nombre) {
	this.nombre = nombre;
}

public String getApellidos() {
	return apellidos;
}

public void setApellidos(String apellidos) {
	this.apellidos = apellidos;
}

public String getDireccion() {
	return direccion;
}

public void setDireccion(String direccion) {
	this.direccion = direccion;
}

public String getEmail() {
	return email;
}

public void setEmail(String email) {
	this.email = email;
}

public LocalDate getFechaRegistro() {
	return fechaRegistro;
}

public void setFechaRegistro(LocalDate fechaRegistro) {
	this.fechaRegistro = fechaRegistro;
}



}


