package seguridad.restcontroller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import seguridad.model.Producto;
import seguridad.model.Libro;
import seguridad.model.Papeleria;

import seguridad.repository.LibroRepository;
import seguridad.repository.PapeleriaRespository;

import seguridad.service.ProductoService;

@RestController
@RequestMapping("/productos")
@CrossOrigin(origins = "*")
public class ProductoRestController {

    @Autowired
    private ProductoService productoService;

    @Autowired
    private LibroRepository libroRepo;

    @Autowired
    private PapeleriaRespository papeleriaRepo;

    // Destacado

    @PutMapping("{idProducto}/destacado")
    @PreAuthorize("hasAnyRole('ADMON', 'JEFE', 'TRABAJADOR')")
    public ResponseEntity<?> elegirDestacado(@PathVariable Integer idProducto) {
        Producto producto = productoService.escogerDestacado(idProducto);
        return ResponseEntity.ok(producto);
    }

    @GetMapping("/destacado")
    public ResponseEntity<?> mostrarDestacado() {
        Producto producto = productoService.getProductoDestacado();
        return ResponseEntity.ok(producto);
    }
    

    
    // Listar todos
    @GetMapping("/todos")
    public ResponseEntity<?> todos() {
        List<Producto> lista = productoService.findAll();
        lista.forEach(p -> p.setCostoReal(null));
        return ResponseEntity.ok(lista);
    }

    
    
    // Filtrar
    @GetMapping("/filtrar")
    public ResponseEntity<?> filtrarProductos(
            @RequestParam(required = false) String tipo,
            @RequestParam(required = false) String idioma,
            @RequestParam(required = false) String genero,
            @RequestParam(required = false) String marca,
            @RequestParam(required = false) String categoria,
            @RequestParam(required = false) Double precioMin,
            @RequestParam(required = false) Double precioMax,
            @RequestParam(required = false) String estado) {

        List<Producto> lista = productoService.filtrar(
                tipo, idioma, genero, marca, categoria, precioMin, precioMax, estado
        );
        return ResponseEntity.ok(lista);
    }

    
    
    // Buscador
    @GetMapping("/buscar/todos")
    public ResponseEntity<?> buscarProducto(@RequestParam String texto) {
        List<Producto> lista = productoService.buscardorProducto(texto);
        if (lista.isEmpty()) {
            return ResponseEntity.ok("No hay NINGUN PRODUCTO que coincidan con la busqueda");
        }
        return ResponseEntity.ok(lista);
    }

    // Obtener producto por ID

    @GetMapping("/{id}")
    public ResponseEntity<?> obtenerProductoPorId(@PathVariable Integer id) {

        Producto base;

        try {
            base = productoService.findOne(id);
        } catch (Exception e) {
            return ResponseEntity.status(404).body("Producto no encontrado");
        }

        Libro libro = libroRepo.findById(id).orElse(null);
        Papeleria pap = papeleriaRepo.findById(id).orElse(null);

        if (libro != null) {
            return ResponseEntity.ok(new Object() {
                public final Integer idProducto = base.getIdProducto();
                public final String nombreProducto = base.getNombreProducto();
                public final String descripcion = base.getDescripcion();
                public final Double precio = base.getPrecio();

                public final String tipo = "LIBRO";
                public final String autor = libro.getAutor();
                public final String isbn = libro.getISBN();
                public final Integer numeroPaginas = libro.getNumeroPagina();
                public final String idioma = (libro.getIdioma() != null ? libro.getIdioma().getNombreIdioma() : null);
                public final String resumen = libro.getResumen();
                public final List<?> imagenes = base.getImagenes();
            });
        }

        if (pap != null) {
            return ResponseEntity.ok(new Object() {
                public final Integer idProducto = base.getIdProducto();
                public final String nombreProducto = base.getNombreProducto();
                public final String descripcion = base.getDescripcion();
                public final Double precio = base.getPrecio();

                public final String tipo = "PAPELERIA";
                public final String marca = (pap.getMarca() != null ? pap.getMarca().getNombreMarca() : null);
                public final String categoria = (pap.getCategoria() != null ? pap.getCategoria().getNombreCategoria() : null);

                public final List<?> imagenes = base.getImagenes();
            });
        }

        return ResponseEntity.ok(base);
    }
    

    // Eliminar

    @DeleteMapping("/eliminar/{idProducto}")
    @PreAuthorize("hasRole('ADMON')")
    public ResponseEntity<?> delete(@PathVariable Integer idProducto) {

        int resultado = productoService.deleteById(idProducto);

        if (resultado == 1)
            return ResponseEntity.ok("Ya eliminado");

        if (resultado == -1)
            return ResponseEntity.status(404).body("Producto no encontrado");

        return ResponseEntity.status(500).body("Error al eliminar");
    }

    // Productos relacionados

    @GetMapping("/relacionados/libro")
    public ResponseEntity<?> relacionadosLibro(
            @RequestParam String autor,
            @RequestParam String genero,
            @RequestParam Integer idActual) {

        List<Producto> lista = productoService.relacionadosLibro(autor, genero, idActual);
        return ResponseEntity.ok(lista);
    }

    @GetMapping("/relacionados/papeleria")
    public ResponseEntity<?> relacionadosPapeleria(
            @RequestParam String marca,
            @RequestParam String categoria,
            @RequestParam Integer idActual) {

        List<Producto> lista = productoService.relacionadosPapeleria(marca, categoria, idActual);
        return ResponseEntity.ok(lista);
    }
    
    @GetMapping("/filtro/estado")
    public ResponseEntity<?> filtroPorProducto(@RequestParam(required = false) String estadoProducto){
    	
    	return ResponseEntity.ok(productoService.filtroEstado(estadoProducto));
    }
}
