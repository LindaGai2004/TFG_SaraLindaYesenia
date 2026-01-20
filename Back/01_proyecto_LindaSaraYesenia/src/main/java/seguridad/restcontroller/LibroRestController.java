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
import org.springframework.web.bind.annotation.RestController;

import seguridad.model.Libro;
import seguridad.service.LibroService;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/libros")
public class LibroRestController {

	@Autowired
	private LibroService libroService;

	
	@GetMapping("/todos")
	public ResponseEntity<?> todos(){
		List<Libro> libro = libroService.findAll();
		libro.forEach(l -> l.setCostoReal(null));
		return ResponseEntity.ok(libro);
	}
	
	/*
	//buscar uno por id
	@GetMapping("/{idProducto}")
	public ResponseEntity<?> obtenerLibro(@PathVariable Integer idProducto) {
		Libro libro = libroService.findOne(idProducto);
		return ResponseEntity.ok(libro);
	}*/
	

	@PostMapping("/altaLibro")
	@PreAuthorize("hasRole('ADMON')")
	public ResponseEntity<?> insertar(@RequestBody Libro libro) {
		Libro creado = libroService.insertarLibro(libro);
		return ResponseEntity.ok(creado);
	}

	@PutMapping("/modificarLibro")
	@PreAuthorize("hasRole('ADMON')")
	public ResponseEntity<?> modificar(@RequestBody Libro libro) {
		Libro modificado = libroService.updateLibro(libro);
		return ResponseEntity.ok(modificado);
	}

}
