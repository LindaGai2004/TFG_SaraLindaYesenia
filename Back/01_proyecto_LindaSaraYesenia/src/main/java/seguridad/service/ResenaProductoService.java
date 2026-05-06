package seguridad.service;

import java.util.List;

import org.springframework.stereotype.Service;

import seguridad.model.ResenaProducto;

@Service
public interface ResenaProductoService {

    ResenaProducto guardarResena(ResenaProducto resena);
    List<ResenaProducto> getResenasPorProducto(int idProducto);
    Double getMediaCalificacion(int idProducto);
    boolean usuarioYaConResena(int idUsuario, int idProducto);
    void deleteById(int idResena);
}