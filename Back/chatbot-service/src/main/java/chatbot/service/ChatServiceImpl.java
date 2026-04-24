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

				Sé inteligente: "para adultos", "algo romántico", "para regalar", "con muchas páginas"
				son búsquedas de LIBRO. "para niños pequeños" puede ser LIBRO o PAPELERIA.
				Solo usa FAQ cuando claramente no busca un producto.

				Responde ÚNICAMENTE con el formato tipo:keyword, sin explicación.
				""".formatted(contexto, mensaje);

		return llamarIA(prompt).trim().toLowerCase();
	}

	private Double extraerPrecioMax(String mensaje) {
		String[] palabras = mensaje.toLowerCase().split("\\s+");
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
	private String responderFAQ(String mensaje) {
		String prompt = """
				Eres el asistente de una librería online llamada Archives.

				Información de la tienda:
				- Horario de atención: Lunes a Viernes de 9:00 a 18:00
				- Envíos: España peninsular 3-5 días laborables, Islas y Portugal 5-7 días
				- Gastos de envío: gratuitos a partir de 30€, 3.99€ en pedidos menores
				- Devoluciones: 14 días desde la recepción, producto en perfecto estado
				- Métodos de pago: tarjeta de crédito/débito, PayPal, transferencia bancaria
				- Para incidencias con pedidos: soporte@archives.com

				Responde de forma amable y breve.

				SOLO responde NECESITA_SOPORTE si el usuario tiene un problema concreto \
				con un pedido existente, una incidencia de envío, o una devolución en curso.

				Si el usuario hace una pregunta sobre productos que no entiendes bien, \
				responde con una sugerencia amable de reformular, NO con NECESITA_SOPORTE.

				Pregunta: %s
				""".formatted(mensaje);
		return llamarIA(prompt);
	}

	private String recomendarProductos(String mensaje, String productosFormateados,
			List<Map<String, String>> historial) {
		String prompt = """
						Eres el asistente de una librería online que también vende papelería.
						Recomienda productos SOLO de esta lista, de forma natural sin mencionar que es una lista.

						Productos disponibles:
						%s

						Petición del usuario: %s

						Instrucciones:
						- Recomienda solo productos de la lista disponibles
						- Escribe MÁXIMO 1 frase de introducción, sin mencionar nombres ni precios
						- La frase de introducción debe ser completamente genérica, por ejemplo: \
						"¡Claro! Aquí tienes algunas opciones." o "Encontré esto para ti." \
						NUNCA menciones el nombre, tipo o características del producto en el texto
						- Los nombres y precios ya aparecen en tarjetas visuales, NO los repitas
						- Si el usuario filtra por precio, muestra ÚNICAMENTE los que cumplan ese precio exacto
						- Si el usuario pide un tipo específico (ej: "libreta", "cuaderno", "bloc"), \
						  muestra SOLO los productos cuyo nombre contenga esa palabra
						- Si ninguno encaja con la petición, dilo en una sola frase amable
						- Termina siempre con una pregunta breve como "¿Te puedo ayudar con algo más?"
						- Termina siempre con: "¿Tienes alguna preferencia de precio, marca o características?"
						""".formatted(productosFormateados, mensaje);

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

		// Si es refinamiento de precio, recupera la keyword anterior del historial
		Double precioMax = extraerPrecioMax(mensaje);
		// Solo aplica filtro de nombre si es un refinamiento conversacional
		// no cuando es la búsqueda inicial de categoría
		String filtroNombre = null;
		if (historial != null && !historial.isEmpty()) {
			filtroNombre = extraerFiltroNombre(mensaje, historial);
		}
		final String filtroNombreFinal = filtroNombre;

		if (precioMax != null && historial != null && !historial.isEmpty()) {
			// Busca la última keyword de búsqueda en el historial
			for (int i = historial.size() - 1; i >= 0; i--) {
				Map<String, String> msg = historial.get(i);
				if ("user".equals(msg.get("role"))) {
					String msgAnterior = msg.get("content");
					String kwAnterior = extraerKeyword(msgAnterior, null);
					if (!kwAnterior.startsWith("faq") && !kwAnterior.equals("general:general")) {
						// Usa la keyword anterior pero con el precio del mensaje actual
						String[] partesAnt = kwAnterior.split(":", 2);
						tipo = partesAnt.length == 2 ? partesAnt[0] : tipo;
						keyword = partesAnt.length == 2 ? partesAnt[1] : keyword;
						break;
					}
				}
			}
		}

		if (tipo.equals("faq")) {
			String respuestaFaq = responderFAQ(mensaje);
			if (respuestaFaq.trim().equals("NECESITA_SOPORTE")) {
				return new ChatResponse("No tengo esa información disponible, pero nuestro equipo puede ayudarte.",
						true);
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
				.filter(p -> precioMax == null || p.getPrecio() <= precioMax).filter(p -> filtroNombreFinal == null
						|| p.getNombreProducto().toLowerCase().contains(filtroNombreFinal))
				.limit(3).toList();

		if (disponibles.isEmpty()) {
			return new ChatResponse(
					"No encontré productos" + (precioMax != null ? " por menos de " + precioMax + "€" : "")
							+ " en esta categoría. ¿Quieres que busque algo diferente?");
		}

		String productosFormateados = mapearProductosParaGPT(disponibles);
		String respuesta = recomendarProductos(mensaje, productosFormateados, historial);

		return new ChatResponse(respuesta, disponibles);
	}

}
