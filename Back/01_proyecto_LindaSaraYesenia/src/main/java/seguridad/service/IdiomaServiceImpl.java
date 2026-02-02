package seguridad.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import seguridad.model.Idioma;
import seguridad.repository.IdiomaRepository;

@Service
public class IdiomaServiceImpl implements IdiomaService {

	@Autowired
	private IdiomaRepository idiomarepositorory;
	
	@Override
	public List<Idioma> findAll() {
		
		return idiomarepositorory.findAll();
	}

}
