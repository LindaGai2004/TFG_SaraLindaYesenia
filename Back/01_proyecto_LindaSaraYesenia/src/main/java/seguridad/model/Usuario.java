package seguridad.model;

import java.io.Serializable;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
@AllArgsConstructor 
@NoArgsConstructor 
@Data 
@Builder
@Entity
@Table(name="USUARIOS")
public class Usuario implements UserDetails, Serializable{
	
	private static final long serialVersionUID = 1L;
	
	@Id
	@Column(name="id_usuario")
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer idUsuario;
	
	private String username;
	private String password;
	private String nombre;
	private String apellidos;
	private int enabled;
	@Column(name="FECHA_REGISTRO")
	private LocalDate fechaRegistro;
	@Column(name="FECHA_NACIMIENTO")
	private LocalDate fechaNacimiento;
	@Column(name = "direccion")
	private String direccion;
	@Column(unique = true)
	private String email;
	private String avatar;
	
	@ManyToOne
	@JoinColumn(name="id_perfil")
	private Perfil perfil;
	
	@ManyToMany
	@JoinTable(
	    name = "favoritos",
	    joinColumns = @JoinColumn(name = "id_usuario"),
	    inverseJoinColumns = @JoinColumn(name = "id_producto")
	)
	private List<Producto> favoritos = new ArrayList<>();
	
	
	@Override public String getUsername() { 
		return this.email; 
	}
	
	@Override
	@JsonIgnore
	// Convierte el perfil en un rol que Spring Security entiende (SimpleGrantedAuthority)
	public Collection<? extends GrantedAuthority> getAuthorities() {
	    return List.of(new SimpleGrantedAuthority(perfil.getNombre()));
	}
	
}
