package seguridad.restcontroller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import seguridad.model.Libro;
import seguridad.model.Papeleria;
import seguridad.model.Producto;
import seguridad.model.Usuario;
import seguridad.model.Dto.FiltroProductoDto;
import seguridad.service.ProductoService;

@RestController
@RequestMapping("/productos")
@CrossOrigin(origins = "*")
public class ProductoRestController {
	@Autowired
	private ProductoService productoService;

	//todos los productos => para filtrar todos
	@GetMapping("/todos")
	public ResponseEntity<?> todos(){
		List<Producto> lista = productoService.findAll();
		lista.forEach(p -> p.setCostoReal(null));
		return ResponseEntity.ok(lista);
	}
	
	
	@GetMapping("/filtrar")
	public ResponseEntity<?> filtrarProductos(
	    @RequestParam(required = false) String tipo,
	    @RequestParam(required = false) String idioma,
	    @RequestParam(required = false) String genero,
	    @RequestParam(required = false) String marca,
	    @RequestParam(required = false) String categoria,
	    @RequestParam(required = false) Double precio,
	    @RequestParam(required = false) String estado
	) {
	    List<Producto> lista = productoService.filtrar(
	        tipo, idioma, genero, marca, categoria, precio, estado
	    );
	    return ResponseEntity.ok(lista);
	}

	
	
	@DeleteMapping("/eliminar/{idProducto}")
	@PreAuthorize("hasRole('ADMON')")
	public ResponseEntity<?> delete(@PathVariable Integer idProducto){
		
		int resultado = productoService.deleteById(idProducto);
		
		if (resultado == 1) 
			return ResponseEntity.ok("Ya eliminado");
		
		if (resultado == -1) 
			return ResponseEntity.status(404).body("Producto no encontrado");
		
		return ResponseEntity.status(500).body("Error al eliminar");

	}
	
	@GetMapping("/buscar/todos")
	public ResponseEntity<?> buscarProducto(@RequestParam String texto){
		List<Producto> lista = productoService.buscardorProducto(texto);
		if(lista.isEmpty()) {
			return ResponseEntity.ok("No hay NINGUN PRODUCTO que coincidan con la busqueda");
		}
		return ResponseEntity.ok(lista);
	}
}
