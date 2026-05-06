package seguridad.restcontroller;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class PasswordController {

	@GetMapping("/encrypt")
    public String encrypt(@RequestParam String pwd) {
        return new BCryptPasswordEncoder().encode(pwd);
    }
}
