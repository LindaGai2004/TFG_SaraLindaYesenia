package seguridad.service;

import java.util.List;
import java.util.Map;

import seguridad.model.dto.SeguidorDto;


public interface SeguidorService {
	
    List<SeguidorDto> getSeguidores(Integer idUsuario);
    List<SeguidorDto> getSeguidos(Integer idUsuario);
    Map<String, Object> toggleSeguir(Integer idSeguidor, Integer idSeguido);
	
	
}
