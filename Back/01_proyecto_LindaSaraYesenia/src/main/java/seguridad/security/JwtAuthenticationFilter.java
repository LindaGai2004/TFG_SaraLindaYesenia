package seguridad.security;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;

import io.jsonwebtoken.io.IOException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
@Component
public class JwtAuthenticationFilter {
	private final JwtService jwtService;
	private final UserDetailsService userDetailsService;
	public  JwtAuthenticationFilter(JwtService jwtService, UserDetailsService userDetailsService) {
		this.jwtService = jwtService;
		this.userDetailsService = userDetailsService;
	}

	protected void doFilterInternal(HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain)
			throws ServletException, IOException{
		//obtener header
		final String authHeader = request.getHeader("Authorization");
		//si no hay header o bearer, continuar
		if (authHeader==null||!authHeader.startsWith(Bearer)) {
			filterChain.doFilter(request, response);
			return;
		}
		//Extraer token
		String jwt = authHeader.substring(7);
		//Extraer usuario
		String username = jwtService.extractUsername(jwt);
		if (username != null &&
	            SecurityContextHolder.getContext().getAuthentication() == null) {

	            UserDetails userDetails =
	                    userDetailsService.loadUserByUsername(username);

	            // 5️⃣ Validate token
	            if (jwtService.isTokenValid(jwt, userDetails)) {

	                UsernamePasswordAuthenticationToken authToken =
	                        new UsernamePasswordAuthenticationToken(
	                                userDetails,
	                                null,
	                                userDetails.getAuthorities()
	                        );

	                authToken.setDetails(
	                        new WebAuthenticationDetailsSource()
	                                .buildDetails(request)
	                );

	                // 6️⃣ Set authentication manually
	                SecurityContextHolder.getContext()
	                        .setAuthentication(authToken);
	            }
	        }

	        filterChain.doFilter(request, response);
	}
}
