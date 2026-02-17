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
			throws ServletException, IOException{
		//obtener header
		final String authHeader = request.getHeader("Authorization");
		//si no hay header o bearer, continuar
		if (authHeader==null||!authHeader.startsWith("Bearer ")) {
			filterChain.doFilter(request, response);
			return;
		}
		//Extraer token
		String jwt = authHeader.substring(7);
		//Extraer usuario
		String username = jwtService.extractUsername(jwt);
		//si no se h autenticado aun
		if (username != null &&
	            SecurityContextHolder.getContext().getAuthentication() == null) {
				//Cargar desde bbdd
	            UserDetails userDetails = userDetailsService.loadUserByUsername(username);
	            //validar token
	            if (jwtService.isTokenValid(jwt, userDetails)) {
	            	//crear objeto de autenticacion
	                UsernamePasswordAuthenticationToken authToken =new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());

	                authToken.setDetails(new WebAuthenticationDetailsSource()
	                                .buildDetails(request));
	                //Setear autenticacion manualmente
	                SecurityContextHolder.getContext()
	                        .setAuthentication(authToken);
	            }
	        }
			//continuar
	        filterChain.doFilter(request, response);
	}
}
