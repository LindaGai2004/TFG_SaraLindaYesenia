package seguridad.security;

import java.security.Key;
import java.util.Date;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

@Service
public class JwtService {
	private static final String SUPERSECRET = "WT52]z2xvf]r+bq?P3Xu9Hn-HQxTQ03H";
	
	private Key getSignKey() {
		return Keys.hmacShaKeyFor(SUPERSECRET.getBytes());
	}
	
	//Generar token
	public String generarToken(String email){
		return Jwts.builder()
				.setSubject(email)
				.setIssuedAt(new Date()) // Cuando se ha creado
				.setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 *60)) // cuando caduca
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
	public String extractUsername(String token) {
		return extractAllClaims(token).getSubject();
	}
	
	//Para ver expiracion del token
	private boolean isTokenExpired(String token) {
		return extractAllClaims(token).getExpiration().before(new Date());
	}
	
	//Validar token
	public boolean isTokenValid(String token, UserDetails userDetails) {
		final String username = extractUsername(token);
		return username.equals(userDetails.getUsername()) && !isTokenExpired(token);
	}
}
