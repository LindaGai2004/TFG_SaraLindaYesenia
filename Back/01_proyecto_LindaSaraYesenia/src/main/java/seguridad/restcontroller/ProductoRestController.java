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
import org.springframework.web.bind.annotation.RestController;

import seguridad.model.Libro;
import seguridad.model.Papeleria;
import seguridad.model.Producto;
import seguridad.model.Usuario;
import seguridad.service.ProductoService;

@RestController
@CrossOrigin(origins = "*")
public class ProductoRestController {
	@Autowired
	private ProductoService productoService;

	//todos los productos => para filtrar todos
	@GetMapping("/todos/productos")
	public ResponseEntity<?> todos(){
		List<Producto> lista = productoService.findAll();
		lista.forEach(p -> p.setCostoReal(null));
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
	


}
