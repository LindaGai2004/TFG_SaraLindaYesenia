package seguridad.security;

import java.security.Key;
import java.util.Date;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.HashMap;

@Service
public class JwtService {
	private static final String SUPERSECRET = "WT52]z2xvf]r+bq?P3Xu9Hn-HQxTQ03H";
	
	// transforma la contraseña secreta en una llave real que el sistema puede usar
	private Key getSignKey() {
		return Keys.hmacShaKeyFor(SUPERSECRET.getBytes());
	}
	
	//Generar token
	/*public String generarToken(String email){
		return Jwts.builder()
				.setSubject(email)
				.setIssuedAt(new Date()) // Cuando se ha creado
				.setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 *60)) // cuando caduca
				.signWith(getSignKey(), SignatureAlgorithm.HS256)
				.compact();
	}*/
	// 改方法签名，接收UserDetails而不是String
	public String generarToken(UserDetails userDetails) {
	    Map<String, Object> claims = new HashMap<>();
	    claims.put("roles", userDetails.getAuthorities()
	        .stream()
	        .map(GrantedAuthority::getAuthority)
	        .collect(Collectors.toList()));

	    return Jwts.builder()
	        .setClaims(claims)
	        .setSubject(userDetails.getUsername())
	        .setIssuedAt(new Date())
	        .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60))
	        .signWith(getSignKey(), SignatureAlgorithm.HS256)
	        .compact();
	}
	
	// Leer el token
	private Claims extractAllClaims(String token) {
		return Jwts.parserBuilder()
				.setSigningKey(getSignKey())
				.build()
				.parseClaimsJws(token)
				.getBody();
	}
	
	//Obtener email
	String extractUsername(String token) {
	    try {
	        return extractAllClaims(token).getSubject();
	    } catch (ExpiredJwtException e) {
	        return null;
	    }
	}

	//Para ver expiracion del token
	private boolean isTokenExpired(String token) {
		return extractAllClaims(token).getExpiration().before(new Date());
	}
	
	//Validar token (Comprueba si el token pertenece al usuario correcto y si no está caducado.)
	public boolean isTokenValid(String token, UserDetails userDetails) {
		final String username = extractUsername(token);
		return username.equals(userDetails.getUsername()) && !isTokenExpired(token);
	}
}
