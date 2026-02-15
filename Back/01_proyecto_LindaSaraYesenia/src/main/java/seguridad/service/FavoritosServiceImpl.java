package seguridad.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import seguridad.model.Producto;
import seguridad.model.Usuario;
import seguridad.repository.ProductoRepository;
import seguridad.repository.UsuarioRepository;

@Service
public class FavoritosServiceImpl implements FavoritosService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private ProductoRepository productoRepository;

    @Override
    public List<Producto> getFavoritos(Integer idUsuario) {
        Usuario usuario = usuarioRepository.findById(idUsuario)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        return usuario.getFavoritos();
    }

    @Override
    public void addFavorito(Integer idUsuario, Integer idProducto) {
        Usuario usuario = usuarioRepository.findById(idUsuario)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        Producto producto = productoRepository.findById(idProducto)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado"));

        if (!usuario.getFavoritos().contains(producto)) {
            usuario.getFavoritos().add(producto);
            usuarioRepository.save(usuario);
        }
    }

    @Override
    public void removeFavorito(Integer idUsuario, Integer idProducto) {
        Usuario usuario = usuarioRepository.findById(idUsuario)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        Producto producto = productoRepository.findById(idProducto)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado"));

        usuario.getFavoritos().remove(producto);
        usuarioRepository.save(usuario);
    }
}
