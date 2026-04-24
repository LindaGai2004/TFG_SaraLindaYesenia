package seguridad.security;

import org.springframework.security.web.authentication.HttpStatusEntryPoint;
import org.springframework.http.HttpStatus;

import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    @Bean //cors -> Define las reglas de cors
    public CorsConfigurationSource corsConfigurationSource() {
   
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowCredentials(true); //Seguridad -> permite enviar cookies y headers entre front y back
        config.addAllowedOriginPattern("*");
        //config.setAllowedOrigins(List.of("http://localhost:5173"));
        //config.addAllowedHeader("*");
        config.setAllowedHeaders(List.of("*"));

        //config.addAllowedMethod("*"); //todos los method se puede usar
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        // /** -> todas las rutas en controller; para todas las rutas permite 5137
        // vuelve a spring
        return source;
    }
    
    
    //Configuración de Seguridad principal
    @Bean
    SecurityFilterChain securityFilterChain(HttpSecurity http, AuthenticationProvider authProvider, JwtAuthenticationFilter jwtAuthFilter) throws Exception {

    	http
        .csrf(csrf -> csrf.disable())
        .cors(Customizer.withDefaults()) //activa cors
        //anterior
        //.sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED))
        .sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
        .authenticationProvider(authProvider)
        .authorizeHttpRequests(auth -> auth
       
        // navegador pregunta a back options, y options con permitAll
            .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
           
            // rutas publicas que no necesitan autenticacion
            .requestMatchers(
            	    "/api/login",
            	    "/registro",
            	    "/auth/**",
            	    "/actuator/health",

            	    "/productos/todos",
            	    "/productos/filtrar",
            	    "/productos/**",

            	    "/todos",
            	    "/recomendados",
            	    "/buscar",
            	    "/libros/**",
            	    "/papelerias/**",
            	    "/uploads/**",
            	    "/generos/**",
            	    "/idiomas/**",
            	    "/categorias/**",
            	    "/marcas/**",
            	    
            	    "/encrypt"
            	).permitAll()

	            .requestMatchers(HttpMethod.GET, "/publicaciones/**").permitAll()
	        	.requestMatchers(HttpMethod.POST, "/publicaciones").permitAll()
            	.requestMatchers(HttpMethod.DELETE, "/publicaciones/**").authenticated()
            	
            	.requestMatchers("/publicaciones/*/like").authenticated()
            	.requestMatchers("/publicaciones/*/comentarios").authenticated()
            	.requestMatchers(HttpMethod.POST, "/usuarios/*/seguir").authenticated()

            
            //endpoints protegidos por rol
            .requestMatchers("/admin/crear").hasAnyRole("ADMON","JEFE")
            .requestMatchers("/pedidos/**").authenticated()
            .requestMatchers("/carrito/**").authenticated()
            .requestMatchers("/rol/**").authenticated()
            .requestMatchers("/api/paypal/**").permitAll()
            .requestMatchers("/productos/buscar-chatbot").permitAll()
            .requestMatchers("/productos/filtrar-chatbot").permitAll()
            .requestMatchers("/usuarios/favoritos/**").authenticated()
          //otras requests deben ser autenticadas
            .anyRequest().authenticated()
        )
        

        //activar jwt
        .addFilterBefore(jwtAuthFilter, org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter.class)
        .formLogin(form -> form.disable())
        .exceptionHandling(ex -> ex.authenticationEntryPoint(
        		new HttpStatusEntryPoint(HttpStatus.UNAUTHORIZED)));


    return http.build();
    }
   
    //Todas las contraseñas guardadas encriptadas en BBDD
//    @Bean
//    public PasswordEncoder passwordEncoder() {
    	//anterior
        //return PasswordEncoderFactories.createDelegatingPasswordEncoder();
//    	return new BCryptPasswordEncoder();
//    }
    
    
    //Verificar username y password si esta bien -> buscar en sql
    @Bean
    @SuppressWarnings("unused")
    AuthenticationProvider authenticationProvider(UserDetailsService uds, PasswordEncoder passwordEncoder) {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
        provider.setUserDetailsService(uds);
        provider.setPasswordEncoder(passwordEncoder);
        return provider;
    }
    
    @Bean
    // necesita AuthenticationProvider
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) throws Exception {
        return authConfig.getAuthenticationManager();
    }
    
    // Sirve para que no se duplique el filtro JWT y use el filtro correcto
    @Bean
    public JwtAuthenticationFilter jwtAuthFilter(JwtService jwtService, UserDetailsService userDetailsService) {
        return new JwtAuthenticationFilter(jwtService, userDetailsService);
    }

}