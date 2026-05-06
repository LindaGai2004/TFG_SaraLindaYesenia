package seguridad.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import seguridad.model.Marca;
import seguridad.repository.MarcaRepository;

@Service
public class MarcaServiceImpl implements MarcaService {

	@Autowired 
	private MarcaRepository marcarepository; 
	
	@Override 
	public List<Marca> findAll() { 
		return marcarepository.findAll(); 
	}

}
