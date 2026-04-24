package seguridad.service;

import java.util.List;
import org.springframework.stereotype.Service;
import seguridad.model.Producto;
import seguridad.model.dto.ProductoChatbotDto;

@Service
public interface ProductoService {
    
    List<Producto> findAll();

    Producto findOne(Integer idProducto);

    int deleteById(Integer idProducto);

    // Para mostrar el producto destacado en Home
    Producto getProductoDestacado();

    // Para que el admin pueda escoger en su dashboard
    Producto escogerDestacado(Integer idProducto);

    List<Producto> buscardorProducto(String texto);

    List<Producto> filtrar(
        String tipo,
        String idioma,
        String genero,
        String marca,
        String categoria,
        Double precioMin,
        Double precioMax,
        String estado
    );

    // Para productos relacionados
    List<Producto> relacionadosLibro(String autor, String genero, Integer idActual);

    List<Producto> relacionadosPapeleria(String marca, String categoria, Integer idActual);
    // para buscar en libros y papeleria por separado y devuelev una lista unificada de dtos
    List<ProductoChatbotDto> buscarParaChatbot(String texto);
    List<Producto> filtrarParaChatbot(String genero, String categoria, String tipo);
}