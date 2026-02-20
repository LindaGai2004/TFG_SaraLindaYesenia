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
// Ya se define en el bean de SecurityFilter
//    private final AuthenticationProvider authenticationProvider;
//
//
//    SecurityConfig(AuthenticationProvider authenticationProvider) {
//        this.authenticationProvider = authenticationProvider;
//    }


    @Bean //cors -> Define las reglas de cors
    public CorsConfigurationSource corsConfigurationSource() {
   
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowCredentials(true); //Seguridad -> permite enviar cookies y headers entre front y back
        config.setAllowedOrigins(List.of("http://localhost:5173"));
        //config.addAllowedHeader("*");
        config.setAllowedHeaders(List.of("*"));

        //config.addAllowedMethod("*"); //todos los method se puede usar
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        // /** -> todas las rutas en controller; para todas las rutas permite 5137
        // vuelve a spring
        	return source;
        /* Esquema  de cors
          传入请求: GET /api/usuarios
          ↓
			Spring Security 询问: "/api/usuarios 有什么 CORS 规则?"
			        ↓
			UrlBasedCorsConfigurationSource 查找: "/** 匹配 /api/usuarios"
			        ↓
			返回: config (允许 localhost:5173,所有方法等)
			        ↓
			Spring Security 应用这些规则
			          */
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
            	    "/todos",
            	    "/actuator/health",
            	    "/todos/productos",
            	    "/libros/**",
            	    "/papelerias/**",
            	    "/productos/**",
            	    "/uploads/**",
            	    "/generos/**",
            	    "/idiomas/**",
            	    "/categorias/**",
            	    "/marcas/**"
            	).permitAll()
            //endpoints protegidos por rol
            .requestMatchers("/admin/crear").hasAnyRole("ADMON","JEFE")
            .requestMatchers("/pedidos/**").authenticated()
            .requestMatchers("/carrito/**").authenticated()
            .requestMatchers("/rol/**").authenticated()
            .requestMatchers("/api/paypal/**").permitAll()
            .requestMatchers("/usuarios/favoritos/**").authenticated()
          //otras requests deben ser autenticadas
            .anyRequest().authenticated()
        )
        //ya no usamos hhtpBasic
        //.httpBasic(Customizer.withDefaults())
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
}