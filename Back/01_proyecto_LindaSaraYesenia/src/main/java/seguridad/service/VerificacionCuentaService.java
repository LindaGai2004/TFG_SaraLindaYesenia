package seguridad.service;

import java.util.Optional;

import seguridad.model.Usuario;
import seguridad.model.VerificacionCuenta;

public interface VerificacionCuentaService {

    VerificacionCuenta crearToken(Usuario usuario);

    Optional<VerificacionCuenta> obtenerPorToken(String token);

    void eliminarTokensDeUsuario(Usuario usuario);

    VerificacionCuenta generarNuevoToken(Usuario usuario);
}
