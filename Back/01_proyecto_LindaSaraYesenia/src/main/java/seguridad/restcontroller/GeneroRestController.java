package seguridad.restcontroller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import seguridad.service.GeneroService;

@RestController 
@RequestMapping("/generos") 
@CrossOrigin(origins = "*")
public class GeneroRestController {

	@Autowired 
	private GeneroService generoService; 
	
	@GetMapping("/todos") 
	public ResponseEntity<?> todos() { 
		return ResponseEntity.ok(generoService.findAll()); 
	}
}
