package seguridad.service;

import java.util.List;

import seguridad.model.Producto;

public interface FavoritosService {

    List<Producto> getFavoritos(Integer idUsuario);

    void addFavorito(Integer idUsuario, Integer idProducto);

    void removeFavorito(Integer idUsuario, Integer idProducto);
}
