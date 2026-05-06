package seguridad.restcontroller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import seguridad.service.CategoriaService;

@RestController
@RequestMapping("/categorias")
@CrossOrigin(origins = "*")
public class CategoriaRestController {

    @Autowired
    private CategoriaService categoriaService;

    @GetMapping("/todos")
    public ResponseEntity<?> todos() {
        return ResponseEntity.ok(categoriaService.findAll());
    }
}