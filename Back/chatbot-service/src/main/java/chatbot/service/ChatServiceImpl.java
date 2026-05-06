package chatbot.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;
import org.springframework.web.server.ResponseStatusException;

import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import chatbot.configs.RestConfig;
import chatbot.dto.ChatRequest;
import chatbot.dto.ChatResponse;
import chatbot.dto.ProductoDto;

@Service
public class ChatServiceImpl implements ChatService {

	@Value("${openai.api.key}")
	private String apiKey;

	private static final String OPENAI_URL = "https://api.openai.com/v1/chat/completions";
	private static final String MODEL = "gpt-4o-mini";
	private final WebClient webClient = WebClient.builder().build();
	private static final String PRODUCTOS_URL = "http://localhost:9001/productos/buscar-chatbot?texto=";

	// Un solo metodo privado que hace la llamada a OpenAI
	private String llamarIA(String prompt, List<Map<String, String>> historial) {
		List<Map<String, String>> mensajes = new ArrayList<>();

		// Para añadir el historial previo de mensajes
		if (historial != null) {
			mensajes.addAll(historial);
		}
		// Añadir el mensaje actual
		mensajes.add(Map.of("role", "user", "content", prompt));

		Map<String, Object> body = Map.of("model", MODEL, "messages", mensajes);
		try {
			// Es como hacer un POST
			String response = webClient.post().uri(OPENAI_URL)
					// autenticacion
					.header(HttpHeaders.AUTHORIZATION, "Bearer " + apiKey)
					.header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
					// enviar pregunta del usuario
					.bodyValue(body).retrieve().bodyToMono(String.class).block();
			ObjectMapper mapper = new ObjectMapper();
			JsonNode root = mapper.readTree(response);
			return root.path("choices").get(0).path("message").path("content").asText();

		} catch (WebClientResponseException ex) {
			throw new ResponseStatusException(HttpStatus.BAD_GATEWAY,
					"OpenAI devolvió " + ex.getStatusCode().value() + ": " + ex.getResponseBodyAsString(), ex);
		} catch (Exception ex) {
			throw new ResponseStatusException(HttpStatus.BAD_GATEWAY, "Error al conectar con OpenAI", ex);
		}
	}

	// sobrecarga sin historial para los métodos que no lo necesitan
	private String llamarIA(String prompt) {
		return llamarIA(prompt, null);
	}
	
	// llamar al endpoint de productos
	public List<ProductoDto> buscarProductos(String keyword) {
		
		try {
			String json = webClient.get().uri(PRODUCTOS_URL + keyword).retrieve().bodyToMono(String.class).block();
			ObjectMapper mapper = new ObjectMapper();
			// Configura para ignorar campos desconocidos
			mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
			return mapper.readValue(json,
					mapper.getTypeFactory().constructCollectionType(List.class, ProductoDto.class));

		} catch (Exception e) {
			return new ArrayList<>();
		}
	}

	// Gpt extrae palabras clave o devuelve sin_busqueda
	private String extraerKeyword(String mensaje, List<Map<String, String>> historial) {
		// Construye contexto del historial para que GPT entienda el mensaje
		String contexto = "";
		if (historial != null && !historial.isEmpty()) {
			// Toma los últimos 2 mensajes para dar contexto
			int desde = Math.max(0, historial.size() - 2);
			StringBuilder sb = new StringBuilder();
			for (int i = desde; i < historial.size(); i++) {
				sb.append(historial.get(i).get("role")).append(": ").append(historial.get(i).get("content"))
						.append("\n");
			}
			contexto = "Conversación previa:\n" + sb + "\n";
		}

		String prompt = """
		        Eres el clasificador de intenciones de una librería online que vende libros y papelería.
				
		        %s
		        Mensaje del usuario: "%s"

		        Clasifica la intención en uno de estos formatos:
		        - LIBRO:keyword   → si busca un libro (keyword = género, autor, tema, característica)
		        - PAPELERIA:keyword → si busca papelería (keyword = tipo de producto)
		        - GENERAL:general → si busca productos sin especificar tipo, o por precio
		        - FAQ:sin_busqueda → si es una pregunta sobre la tienda, saludo, o no busca productos

		        IMPORTANTE: Si el usuario escribe exactamente "libros" o "libro", clasifica SIEMPRE como LIBRO:libro.
		        Si el usuario escribe exactamente "papeleria" o "papelería", clasifica SIEMPRE como PAPELERIA:papeleria.
		        Estas palabras solas son cambios de categoría explícitos, ignora el contexto previo.
								
		        Sé inteligente: "para adultos", "algo romántico", "para regalar", "con muchas páginas"
		        son búsquedas de LIBRO. "para niños pequeños" puede ser LIBRO o PAPELERIA.
		        Solo usa FAQ cuando claramente no busca un producto.

		        Responde ÚNICAMENTE con el formato tipo:keyword, sin explicación.
				IMPORTANTE: Si el usuario escribe "clásicos", "clasicos", "clásico", "clasico", 
				"literatura clásica", clasifica como LIBRO:clásicos
				
		        IMPORTANTE: Si el usuario escribe "no lo sé", "no sé", "no lo se", "no se", "da igual",
				"cualquiera", "no importa", clasifica SIEMPRE como FAQ:sin_busqueda.
				
						        """
				.formatted(contexto, mensaje);

		return llamarIA(prompt).trim().toLowerCase();
	}

	private Double extraerPrecioMax(String mensaje) {
		String lower = mensaje.toLowerCase();
		if (lower.contains("más de") || lower.contains("mas de") || lower.contains("mayor de")
				|| lower.contains("superior a")) {
			return null;
		}
		String[] palabras = lower.split("\\s+");
		for (int i = 0; i < palabras.length; i++) {
			String palabra = palabras[i].replace("€", "").replace("euros", "").trim();
			try {
				double precio = Double.parseDouble(palabra.replace(",", "."));
				if (precio >= 1 && precio <= 500) {
					return precio;
				}
			} catch (NumberFormatException e) {
			}
		}
		return null;
	}

	private Double extraerPrecioMin(String mensaje) {
		String lower = mensaje.toLowerCase();
		if (!lower.contains("más de") && !lower.contains("mas de") && !lower.contains("mayor de")
				&& !lower.contains("superior a") && !lower.contains("por encima")) {
			return null;
		}
		String[] palabras = lower.split("\\s+");
		for (String palabra : palabras) {
			String limpia = palabra.replace("€", "").replace("euros", "").trim();
			try {
				double precio = Double.parseDouble(limpia.replace(",", "."));
				if (precio >= 1 && precio <= 500) {
					return precio;
				}
			} catch (NumberFormatException e) {
			}
		}
		return null;
	}

	private String extraerFiltroNombre(String mensaje, List<Map<String, String>> historial) {
		String contexto = "";
		if (historial != null && !historial.isEmpty()) {
			int desde = Math.max(0, historial.size() - 2);
			StringBuilder sb = new StringBuilder();
			for (int i = desde; i < historial.size(); i++) {
				sb.append(historial.get(i).get("role")).append(": ").append(historial.get(i).get("content"))
						.append("\n");
			}
			contexto = "Conversación previa:\n" + sb + "\n";
		}

		String prompt = """
				%s
				Mensaje del usuario: "%s"

				Si el usuario especifica un tipo concreto de producto para filtrar \
				(ej: "solo libretas", "que sea cuaderno", "quiero una mochila Nike"), \
				extrae ÚNICAMENTE la palabra clave del tipo de producto en minúsculas.

				Si el mensaje NO especifica un tipo concreto o es una búsqueda general, \
				responde exactamente: null

				Ejemplos:
				"solo libretas" → libreta
				"que sea cuaderno" → cuaderno
				"algo de menos de 15 euros" → null
				"para adultos" → null
				"quiero una mochila" → mochila
				"de Nike" → nike

				Responde ÚNICAMENTE con la palabra clave o null, sin explicación.
				""".formatted(contexto, mensaje);

		String resultado = llamarIA(prompt).trim().toLowerCase();
		if (resultado.equals("null"))
			return null;

		if (resultado.endsWith("s") && resultado.length() > 3) {
			resultado = resultado.substring(0, resultado.length() - 1);
		}

		return resultado;
	}

	// mapear el json para darle un texto con los campos que importan
	// tb filtra los agotados antes de q GPT los vea
	private String mapearProductosParaGPT(List<ProductoDto> productos) {
		StringBuilder sb = new StringBuilder();
		for (ProductoDto p : productos) {
			String linea;
			if ("LIBRO".equalsIgnoreCase(p.getTipoProducto())) {
				linea = String.format("- [LIBRO] %s de %s | Género: %s | Idioma: %s | Precio: %s€%n",
						p.getNombreProducto(), p.getAutor(), p.getGenero(), p.getIdioma(), p.getPrecio());
			} else {
				linea = String.format("- [PAPELERÍA] %s | Categoría: %s | Precio: %s€%n", p.getNombreProducto(),
						p.getCategoria(), p.getPrecio());
			}
			sb.append(linea);
		}
		return sb.toString();
	}

	// Metodos publicos solo para construir prompts
	private String responderFAQ(String mensaje, List<Map<String, String>> historial) {
		String contexto = "";
		if (historial != null && !historial.isEmpty()) {
			int desde = Math.max(0, historial.size() - 4);
			StringBuilder sb = new StringBuilder();
			for (int i = desde; i < historial.size(); i++) {
				sb.append(historial.get(i).get("role")).append(": ").append(historial.get(i).get("content"))
						.append("\n");
			}
			contexto = "Conversación previa:\n" + sb + "\n";
		}

		String prompt = """
				      Eres el asistente de una librería online llamada Archives.

				      %s

				      Información de la tienda:
				      - Horario de atención: Lunes a Viernes de 9:00 a 18:00
				      - Envíos: España peninsular 3-5 días laborables, Islas y Portugal 5-7 días
				      - Gastos de envío: gratuitos a partir de 30€, 3.99€ en pedidos menores
				      - Devoluciones: 14 días desde la recepción, producto en perfecto estado
				      - Métodos de pago: tarjeta de crédito/débito, PayPal, transferencia bancaria
				      - Para incidencias con pedidos: soporte@archives.com

				      Responde de forma amable y breve.

				      Si el usuario responde "no", "nada", "gracias" o similar al final de una conversación,
				      despídete amablemente y ofrece ayuda futura. NO pidas que reformule.

				      SOLO responde exactamente "NECESITA_SOPORTE" (sin nada más) si el usuario menciona
				      explícitamente: pedido no recibido, paquete perdido, retraso en entrega,
				      devolución de un pedido ya realizado, o producto llegó dañado.

				      Para CUALQUIER OTRA cosa que no entiendas, responde con una pregunta amable
				      pidiendo que reformule. NUNCA respondas NECESITA_SOPORTE por no entender.

				Si el usuario dice "no lo sé", "no sé", "da igual" o similar después de que se le ha preguntado
				algo, responde con una sugerencia amable y concreta basada en lo que SÍ puedes hacer.
				Por ejemplo: "¡No hay problema! Puedo buscarte libros por género, autor o precio.
				¿Quieres que empiece por algún género como novela, fantasía o romance?"
				NO menciones "más vendidos", "novedades" ni nada que no puedas mostrar realmente.
				NO pidas que reformule. Ofrece géneros concretos que el usuario pueda elegir.

				      Pregunta: %s
				      """.formatted(contexto, mensaje);
		return llamarIA(prompt, historial);
	}

	private String recomendarProductos(String mensaje, String productosFormateados, List<Map<String, String>> historial,
			int numProductos) {
		String intro = numProductos == 1 ? "una opción" : "algunas opciones";

		String prompt = """
						 Eres el asistente de una librería online que también vende papelería.

						 DATOS DE PRODUCTOS (solo para tu referencia interna, NO los copies en tu respuesta):
						        ---
						        %s
						        ---

						        Petición del usuario: %s

						Instrucciones:
				        - Escribe EXACTAMENTE 1 frase de introducción: "¡Claro! Aquí tienes %s."
				        - NO menciones títulos, autores, precios, idioma ni características en el texto.
				          Toda esa información ya aparece en las tarjetas visuales.
				        - NO copies el formato de los datos de productos en tu respuesta.
				        - Si todos los productos ya fueron mostrados en el historial, responde ÚNICAMENTE:
				          "Lo siento, no tengo más opciones en esta categoría. ¿Quieres que busque otra cosa?"
				        - Después de la introducción, añade UNA pregunta de refinamiento concreta y útil
				          para ayudar a filtrar mejor. Solo puedes preguntar sobre:
				          autor, precio máximo o mínimo, género o idioma si el usuario lo pregunta.
				         Ejemplos válidos: "¿Tienes alguna preferencia?", "¿Buscas algo en concreto?",
				         "¿Tienes un presupuesto en mente?".
						 Usa un tono cercano e informal, como si fuera un librero amigo.
						 - Si solo hay UNA opción disponible, no preguntes sobre preferencias de filtro.
						  En su lugar cierra con: "¿Puedo ayudarte en algo más?"
						- Si hay varias opciones, añade UNA pregunta de refinamiento concreta.
						- NO preguntes "¿Quieres saber más?", "¿Te gustaría más información?" ni similares.
						El usuario ya puede ver los detalles en las tarjetas de producto.
				        - Si el usuario ya ha especificado autor, género, idioma Y precio, no hagas más preguntas.
				        - Después de la introducción, añade UNA pregunta de refinamiento útil.
					  IMPORTANTE: Mira el historial. Si el usuario YA especificó precio, NO preguntes por presupuesto.
					  Si el usuario YA especificó autor, NO preguntes por autor.
					  Si el usuario YA especificó género, NO preguntes por género.
					  Pregunta SOLO por algo que el usuario NO haya especificado todavía.
					  Ejemplos: si ya tiene precio → pregunta por autor o si es para regalo.
					  Si ya tiene precio y autor → no preguntes nada, cierra con "¿Puedo ayudarte en algo más?"
					  Usa un tono cercano e informal, como si fuera un librero amigo.
						        """
				.formatted(productosFormateados, mensaje, intro);
		return llamarIA(prompt, historial);
	}

	// punto de entrada principal
	@Override
	public ChatResponse chat(ChatRequest request) {
		String mensaje = request.getMensaje();
		List<Map<String, String>> historial = request.getHistorial();

		String keywordRaw = extraerKeyword(mensaje, historial);

		String[] partes = keywordRaw.split(":", 2);
		String tipo = partes.length == 2 ? partes[0] : "general";
		String keyword = partes.length == 2 ? partes[1] : keywordRaw;
		if (keyword.equals("libro") || keyword.equals("libros")) {
			keyword = "novela";
			tipo = "libro";
		}
		if (keyword.equals("papeleria") || keyword.equals("papelería")) {
			keyword = "cuaderno";
			tipo = "papeleria";
		}
		if (keyword.equals("mochila") || keyword.equals("mochilas")) {
		    keyword = "mochila";
		    tipo = "papeleria";
		}
		if (keyword.equals("cuaderno") || keyword.equals("cuadernos") || 
		    keyword.equals("libreta") || keyword.equals("libretas")) {
		    keyword = keyword;
		    tipo = "papeleria";
		}
		if (keyword.equals("clasico") || keyword.equals("clasicos") || 
			    keyword.equals("clásico") || keyword.equals("clásicos") || keyword.equals("Clásicos")){
			    keyword = "Clásicos";
			    tipo = "libro";
			}
		// Si es refinamiento de precio, recupera la keyword anterior del historial
		Double precioMax = extraerPrecioMax(mensaje);
		Double precioMin = extraerPrecioMin(mensaje);
		// Solo aplica filtro de nombre si es un refinamiento conversacional
		// no cuando es la búsqueda inicial de categoría
		String filtroNombre = null;
		if (historial != null && !historial.isEmpty()) {
			filtroNombre = extraerFiltroNombre(mensaje, historial);
		}
		final String filtroNombreFinal = filtroNombre;
		if ((precioMax != null || precioMin != null) && historial != null && !historial.isEmpty()) {
			for (int i = historial.size() - 1; i >= 0; i--) {
				Map<String, String> msg = historial.get(i);
				if ("user".equals(msg.get("role"))) {
					String msgAnterior = msg.get("content").toLowerCase();
					if (msgAnterior.matches(".*\\d+.*euro.*") || msgAnterior.matches(".*menos de.*")
							|| msgAnterior.matches(".*mas de.*") || msgAnterior.matches(".*más de.*")
							|| (msgAnterior.length() < 15 && msgAnterior.matches(".*\\d+.*"))) {
						continue;
					}
					if (msgAnterior.length() < 8 && !msgAnterior.contains(" ")) {
					    String[] knownCategories = {"mochila", "mochilas", "agenda", "papel", "novela", 
					                                 "terror", "romance", "aventura", "misterio", "clasico",
					                                 "cuaderno", "libreta"};
					    boolean isKnownCategory = false;
					    for (String cat : knownCategories) {
					        if (msgAnterior.trim().equals(cat)) {
					            isKnownCategory = true;
					            break;
					        }
					    }
					    if (!isKnownCategory) continue;
					}
					String msgLimpio = msgAnterior
						    .replaceAll("\\p{So}", "")
						    .replaceAll("\\p{Cs}", "")  
						    .trim();
					if (msgLimpio.isEmpty()) continue;
					String kwAnterior = extraerKeyword(msgLimpio, null);			
					if (!kwAnterior.startsWith("faq") && !kwAnterior.equals("general:general")) {
						String[] partesAnt = kwAnterior.split(":", 2);
						String tipoAnt = partesAnt.length == 2 ? partesAnt[0] : tipo;
						String keywordAnt = partesAnt.length == 2 ? partesAnt[1] : keyword;
						if (keywordAnt.length() >= 3) {
							tipo = tipoAnt;
							keyword = keywordAnt;
							break;
						}
					}
				}
			}
		}
	
		if (keyword.equals("mochila") || keyword.equals("mochilas")) {
		    keyword = "mochila";
		    tipo = "papeleria";
		}
		if (keyword.equals("cuaderno") || keyword.equals("cuadernos") ||
		    keyword.equals("libreta") || keyword.equals("libretas")) {
		    tipo = "papeleria";
		}
		if (keyword.equals("clasico") || keyword.equals("clasicos") ||
		    keyword.equals("clásico") || keyword.equals("clásicos")) {
		    keyword = "Clásicos";
		    tipo = "libro";
		}
		if (tipo.equals("faq")) {
			String respuestaFaq = responderFAQ(mensaje, historial);
			if (respuestaFaq.trim().equals("NECESITA_SOPORTE")) {
			    return new ChatResponse(
			        "¡Lamentamos lo ocurrido! 😟 Nuestro equipo de soporte puede ayudarte a resolver esto lo antes posible.",
			        true
			    );
			}
			return new ChatResponse(respuestaFaq);
		}

		String textoBusqueda = keyword.equals("general") ? "" : keyword;
		
		List<ProductoDto> productos = buscarProductos(textoBusqueda);

		if (productos == null || productos.isEmpty()) {
			String mensajeNoEncontrado = tipo.equals("libro")
					? "Lo siento, no tenemos nada relacionado con \"" + keyword
							+ "\" en nuestra tienda. ¿Puedo ayudarte a buscar otra cosa?"
					: "Lo siento, no tenemos ese producto disponible en nuestra tienda ahora mismo. ¿Puedo ayudarte a buscar otra cosa?";
			return new ChatResponse(mensajeNoEncontrado);
		}

		List<ProductoDto> disponibles = productos.stream()
				.filter(p -> "DISPONIBLE".equalsIgnoreCase(p.getEstadoProducto()))
				.filter(p -> precioMax == null || p.getPrecio() <= precioMax)
				.filter(p -> filtroNombreFinal == null
						|| p.getNombreProducto().toLowerCase().contains(filtroNombreFinal)
						|| (p.getAutor() != null && p.getAutor().toLowerCase().contains(filtroNombreFinal)))
				.limit(3).toList();

		if (disponibles.isEmpty()) {
			return new ChatResponse(
					"No encontré productos" + (precioMax != null ? " por menos de " + precioMax + "€" : "")
							+ (precioMin != null ? " por más de " + precioMin + "€" : "")
							+ " en esta categoría. ¿Quieres que busque algo diferente?");
		}

		String productosFormateados = mapearProductosParaGPT(disponibles);
		if (disponibles.size() == 1) {
		    return new ChatResponse("¡Claro! Aquí tienes una opción. ¿Puedo ayudarte en algo más?", disponibles);
		}

		String respuesta = recomendarProductos(mensaje, productosFormateados, historial, disponibles.size());

		if (respuesta.toLowerCase().contains("no tengo más") || 
		    respuesta.toLowerCase().contains("no tengo mas")) {
		    return new ChatResponse(respuesta);
		}

		return new ChatResponse(respuesta, disponibles);
	}

}
