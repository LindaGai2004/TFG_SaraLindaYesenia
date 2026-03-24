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
		
		// Permitir preflight OPTIONS (CORS)
	    if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {
	        filterChain.doFilter(request, response);
	        return;
	    }

	    //String path = request.getServletPath();
	    String path = request.getRequestURI();


	 // rutas públicas
	    if (
	    	    path.startsWith("/auth") ||
	    	    path.equals("/api/login") ||
	    	    path.equals("/registro") ||
	    	    path.startsWith("/actuator/health") ||
	    	    path.startsWith("/api/paypal") ||

	    	    // Comunidad (solo GET)
	    	    (path.equals("/publicaciones") && request.getMethod().equals("GET")) ||
	    	    (path.startsWith("/publicaciones/") && request.getMethod().equals("GET")) ||

	    	    // Crear publicación (POST /publicaciones)
	    	    (path.equals("/publicaciones") && request.getMethod().equals("POST")) ||

	    	    // Catálogo
	    	    path.startsWith("/productos") ||
	    	    path.startsWith("/uploads") ||
	    	    path.startsWith("/generos") ||
	    	    path.startsWith("/idiomas") ||
	    	    path.startsWith("/categorias") ||
	    	    path.startsWith("/marcas") ||

	    	    // SidebarDerecha
	    	    path.startsWith("/usuarios/top") ||
	    	    path.startsWith("/libros/populares") ||
	    	    path.startsWith("/publicaciones/tendencias") ||

	    	    // Libros y papelería
	    	    path.startsWith("/libros") ||
	    	    path.startsWith("/papelerias")
	    	) {
	    	    filterChain.doFilter(request, response);
	    	    return;
	    	}



	    // A partir de aquí, rutas protegidas
	    final String authHeader = request.getHeader("Authorization");

	    if (authHeader == null || !authHeader.startsWith("Bearer ")) {
	        filterChain.doFilter(request, response);
	        return;
	    }

	    String jwt = authHeader.substring(7);
	    String username = jwtService.extractUsername(jwt);

	    if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
	        UserDetails userDetails = userDetailsService.loadUserByUsername(username);

	        if (jwtService.isTokenValid(jwt, userDetails)) {
	            UsernamePasswordAuthenticationToken authToken =
	                    new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());

	            authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
	            SecurityContextHolder.getContext().setAuthentication(authToken);
	        }
	    }

	    filterChain.doFilter(request, response);
	}

}