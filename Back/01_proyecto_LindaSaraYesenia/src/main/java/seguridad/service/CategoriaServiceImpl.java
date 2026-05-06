package seguridad.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import seguridad.model.Categoria;
import seguridad.repository.CategoriaRepository;

@Service
public class CategoriaServiceImpl implements CategoriaService {

	@Autowired 
	private CategoriaRepository categoriarepository;
	
	@Override
	public List<Categoria> findAll() {
		
		return categoriarepository.findAll();
	}

}
