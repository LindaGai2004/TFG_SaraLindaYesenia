package seguridad.service;

import java.util.List;
import org.springframework.stereotype.Service;

import seguridad.model.EstadoProducto;
import seguridad.model.Producto;

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
    
    List<Producto> filtroEstado(String estadoProducto);
}