package seguridad.security;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter{
	private final JwtService jwtService;
	private final UserDetailsService userDetailsService;
	
	public  JwtAuthenticationFilter(JwtService jwtService, UserDetailsService userDetailsService) {
		this.jwtService = jwtService;
		this.userDetailsService = userDetailsService;
	}
	
	@Override
	protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
	        throws ServletException, IOException {
		
		// String path = request.getRequestURI();
	    // String method = request.getMethod();
	    
	    /*if ("OPTIONS".equalsIgnoreCase(method)) {
	        filterChain.doFilter(request, response);
	        return;
	    }*/
		
		// Es vital que esto esté al principio para que el navegador no bloquee tus POST/DELETE
	    if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {
	        filterChain.doFilter(request, response);
	        return;
	    }

	    //String path = request.getServletPath();
	    //String path = request.getRequestURI();


	    // Obtener la cabecera de authorization
	    final String authHeader = request.getHeader("Authorization");

	    if (authHeader == null || !authHeader.startsWith("Bearer ")) {
	        filterChain.doFilter(request, response);
	        return;
	    }

	    try {
	    	// extraemos el jwt y nombre del usuario
	    	String jwt = authHeader.substring(7);
	    	String username = jwtService.extractUsername(jwt);
	    
	    	// Si hay usuario y no está autenticado aún
	    	if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
		        UserDetails userDetails = userDetailsService.loadUserByUsername(username);

		        // Valida el token
		        if (jwtService.isTokenValid(jwt, userDetails)) {
		            UsernamePasswordAuthenticationToken authToken =
		                    new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());

		            authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
		            // Establecer la autenticación en el contex
		            SecurityContextHolder.getContext().setAuthentication(authToken);
		        }
		    }

	    } catch (Exception e) {
	    	// Si el token es inválido o expiró
	    	logger.error("No se pudo establecer la autenticación del usuario: " + e.getMessage());
	    }
	    
	    filterChain.doFilter(request, response);
	}

}