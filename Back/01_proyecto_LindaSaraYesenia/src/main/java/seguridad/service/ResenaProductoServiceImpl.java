package seguridad.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import seguridad.model.ResenaProducto;
import seguridad.repository.ResenaProductoRepository;

@Service
public class ResenaProductoServiceImpl implements ResenaProductoService {

	@Autowired
	private ResenaProductoRepository resenaRepo;

	@Override
	public ResenaProducto guardarResena(ResenaProducto resena) {
		return resenaRepo.save(resena);
	}

	@Override
	public List<ResenaProducto> getResenasPorProducto(int idProducto) {
		return resenaRepo.findByProducto_IdProductoOrderByFechaDesc(idProducto);
	}

	@Override
	public Double getMediaCalificacion(int idProducto) {
		// Obtenemos la media. Si es null -> no hay reseñas
		Double media = resenaRepo.obtenerMediaCalificacion(idProducto);
		return (media != null) ? media : 0.0;
	}

	@Override
	public boolean usuarioYaConResena(int idUsuario, int idProducto) {
		return resenaRepo.existsByUsuario_IdUsuarioAndProducto_IdProducto(idUsuario, idProducto);
	}

	@Override
	public void deleteById(int idResena) {
		resenaRepo.deleteById(idResena);
	}

}
