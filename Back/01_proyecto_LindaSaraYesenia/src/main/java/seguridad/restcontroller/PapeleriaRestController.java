package seguridad.restcontroller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import seguridad.model.Libro;
import seguridad.model.Papeleria;
import seguridad.service.PapeleriaService;
@RestController
@RequestMapping("/papelerias")
@CrossOrigin(origins = "*")
public class PapeleriaRestController {
	@Autowired
	private PapeleriaService papeleriaService;

	@GetMapping("/todos")
	public ResponseEntity<?> todos(){
		List<Papeleria> papeleria = papeleriaService.findAll();
		papeleria.forEach(p -> p.setCostoReal(null));
		return ResponseEntity.ok(papeleria);
	}
	
	/*
	@GetMapping("/{idProducto}")
	public ResponseEntity<?> obtenerPapeleria(@PathVariable Integer idProdcto) {
		Papeleria pap = papeleriaService.findOne(idProdcto);
		return ResponseEntity.ok(pap);
	}*/

	@PostMapping("/modificarPapeleria/{idProducto}")
	@PreAuthorize("hasRole('ADMON')")
	public ResponseEntity<?> modificar(@PathVariable Integer idProducto,@RequestBody Papeleria papeleria) {
		papeleria.setIdProducto(idProducto);
		Papeleria modificado = papeleriaService.updatePapeleria(papeleria);
		if(modificado == null) {
			return ResponseEntity.status(404).body("Libro con id : " + idProducto + " no existe");
		}
		return ResponseEntity.ok(modificado);
	}
	
	@PostMapping("/altaPapeleria")
	@PreAuthorize("hasRole('ADMON')")
	public ResponseEntity<?> insertar(@RequestBody Papeleria papeleria) {
		Papeleria creado = papeleriaService.insertPapeleria(papeleria);
		return ResponseEntity.ok(creado);
	}

}
