package seguridad.service;

import java.util.List;

import seguridad.model.Producto;

public interface FavoritosService {

    List<Producto> getFavoritos(Integer idUsuario);

    void añadirFavorito(Integer idUsuario, Integer idProducto);

    void eliminarFavorito(Integer idUsuario, Integer idProducto);
}
