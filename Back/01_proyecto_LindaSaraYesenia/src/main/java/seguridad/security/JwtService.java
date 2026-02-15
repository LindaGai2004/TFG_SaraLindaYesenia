package seguridad.security;

import java.security.Key;
import java.util.Date;
import java.util.function.Function;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
@Service
public class JwtService {
	
	private final String SECRETKEY= "HLKPdt/9Lpr/KVZ";
	
	//Genera los tokens con el login y los valida
	private Key getSignKey() {
		return Keys.hmacShaKeyFor(SECRETKEY.getBytes());
	}
	public String generateToken(String username) {
		return Jwts.builder()
				.setSubject(username)
				.setIssuedAt(new Date())
				//expira en una hora
				.setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 *60))
				//algoritmo: HS256
				.signWith(getSignKey(), SignatureAlgorithm.HS256)
				.compact();
	}
	//Extrae el usuario del token
	public String extractUsername(String token) {
		return Jwts.parserBuilder()
				.setSigningKey(getSignKey())
				.build()
				.parseClaimsJws(token)
				.getBody()
				.getSubject();
	}
	private Date extractExpiration(String token) {
		return Jwts.parserBuilder()
	            .setSigningKey(getSignKey())
	            .build()
	            .parseClaimsJws(token)
	            .getBody()
	            .getExpiration();
	}
	public boolean isTokenExpired(String token) {
		return extractExpiration(token).before(new Date());
	}
	public boolean isTokenValid(String token, UserDetails userDetails) {
		final String email = extractUsername(token);
		return (email.equals(userDetails.getUsername()) && !isTokenExpired(token));
		
		
	}
}
