package seguridad.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import seguridad.model.Usuario;
import seguridad.model.VerificacionCuenta;
import seguridad.repository.VerificacionCuentaRepository;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Service
public class VerificacionCuentaServiceImpl implements VerificacionCuentaService {

    @Autowired
    private VerificacionCuentaRepository verificacionRepo;

    @Override
    public VerificacionCuenta crearToken(Usuario usuario) {

        VerificacionCuenta token = new VerificacionCuenta();
        token.setToken(UUID.randomUUID().toString());
        token.setUsuario(usuario);
        token.setCreadoEn(LocalDateTime.now());
        token.setExpiracion(LocalDateTime.now().plusHours(24)); // 24h de validez

        return verificacionRepo.save(token);
    }

    @Override
    public Optional<VerificacionCuenta> obtenerPorToken(String token) {
        return Optional.ofNullable(verificacionRepo.findByToken(token));
    }

    @Override
    public void eliminarTokensDeUsuario(Usuario usuario) {
        verificacionRepo.deleteByUsuario(usuario);
    }

    @Override
    public VerificacionCuenta generarNuevoToken(Usuario usuario) {
        // Borrar tokens anteriores
        eliminarTokensDeUsuario(usuario);

        // Crear uno nuevo
        return crearToken(usuario);
    }
}
