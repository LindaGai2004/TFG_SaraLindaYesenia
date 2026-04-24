package seguridad.restcontroller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import seguridad.model.Libro;
import seguridad.repository.PerfilRepository;
import seguridad.service.LibroService;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/libros")
public class LibroRestController {

    private PerfilRepository perfilRepository;
    

	@Autowired
	private LibroService libroService;

	@GetMapping("/todos")
	public ResponseEntity<?> todos(){
		List<Libro> libro = libroService.findAll();
		libro.forEach(l -> l.setCostoReal(null));
		return ResponseEntity.ok(libro);
	}
	
	@GetMapping("/{idProducto}")
	public ResponseEntity<?> obtenerLibro(@PathVariable Integer idProducto) {
	    Libro libro = libroService.findOne(idProducto);
	    return ResponseEntity.ok(libro);
	}
	
	@PutMapping("/modificarLibro/{idProducto}")
	@PreAuthorize("hasRole('ADMON')")
	public ResponseEntity<?> modificar(@PathVariable Integer idProducto, @RequestBody Libro libro) {
		libro.setIdProducto(idProducto);
		Libro modificado = libroService.updateLibro(libro);
		if(modificado == null) {
			return ResponseEntity.status(404).body("Libro con id : " + idProducto + " no existe");

		}
		return ResponseEntity.ok(modificado);
		
	}

	@PostMapping("/altaLibro")
	@PreAuthorize("hasRole('ADMON')")
	public ResponseEntity<?> insertar(@RequestBody Libro libro) {
		Libro creado = libroService.insertarLibro(libro);
		return ResponseEntity.ok(creado);
	}

	@GetMapping("/buscar")
	public ResponseEntity<?> buscarLibro(@RequestParam String texto){
		List<Libro> lista = libroService.buscadorLibro(texto);
		if(lista.isEmpty()) {
			return ResponseEntity.ok(List.of());
		}
		return ResponseEntity.ok(lista);
	}
	
	
	/* Libros populares para la Comunidad*/
	@GetMapping("/populares")
	public ResponseEntity<?> librosPopulares() {
	    List<Libro> lista = libroService.findLibrosPopulares();
	    lista.forEach(l -> l.setCostoReal(null));
	    return ResponseEntity.ok(lista);
	}
}
