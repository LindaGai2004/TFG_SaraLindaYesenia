package seguridad.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import seguridad.model.Genero;
import seguridad.repository.GeneroRepository;

@Service
public class GeneroServiceImpl implements GeneroService {

    @Autowired 
    private GeneroRepository generorepository;
    
    @Override
    public List<Genero> findAll() {
        return generorepository.findAll();
    }
}
