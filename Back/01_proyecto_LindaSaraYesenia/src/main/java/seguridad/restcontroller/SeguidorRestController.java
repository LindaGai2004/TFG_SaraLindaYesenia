package seguridad.restcontroller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import seguridad.model.dto.SeguidorDto;
import seguridad.service.SeguidorService;

@RestController
@RequestMapping("/usuarios")
public class SeguidorRestController {



	    @Autowired
	    private SeguidorService seguidorService;
	    

	    @GetMapping("/{id}/seguidores")
	    public ResponseEntity<List<SeguidorDto>> getSeguidores(@PathVariable Integer id) {
	        return ResponseEntity.ok(seguidorService.getSeguidores(id));
	    }

	    @GetMapping("/{id}/seguidos")
	    public ResponseEntity<List<SeguidorDto>> getSeguidos(@PathVariable Integer id) {
	    	System.out.println("✅ LLEGÓ A SEGUIDOS: " + id);
	        return ResponseEntity.ok(seguidorService.getSeguidos(id));
	    }

	    @PostMapping("/{id}/seguir")
	    public ResponseEntity<Map<String, Object>> toggleSeguir(
	            @PathVariable Integer id,
	            @RequestParam Integer idUsuarioActual) {
	        return ResponseEntity.ok(seguidorService.toggleSeguir(idUsuarioActual, id));
	    }


}
