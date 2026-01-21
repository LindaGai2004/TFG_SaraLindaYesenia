package seguridad.service;

import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import seguridad.model.Libro;
import seguridad.repository.LibroRepository;

@Service
public class LibroServiceImpl implements LibroService {
	
	@Autowired
	private LibroRepository libroRepo;

	@Override
	public List<Libro> findAll() {
		return libroRepo.findAll();
	}
	@Override
	public Libro findOne(Integer idProducto) {
		return libroRepo.findById(idProducto).orElseThrow();
	}

	@Override
	public Libro insertarLibro (Libro libro) {
		libro.setFechaAlta(LocalDate.now());
		return libroRepo.save(libro);
	}

	@Override
	public Libro updateLibro (Libro libro) {
		
		Libro existente = findOne(libro.getIdProducto());
	
		//Campos heredados de producto
		existente.setNombreProducto(libro.getNombreProducto());
		existente.setDescripcion(libro.getDescripcion());
		existente.setPrecio(libro.getPrecio());
		existente.setStock(libro.getStock());
		existente.setEstadoProducto(libro.getEstadoProducto());
		existente.setFechaAlta(libro.getFechaAlta());
		existente.setCostoReal(libro.getCostoReal());
	
		//Campos de Libro
		existente.setISBN(libro.getISBN());
		existente.setEditorial(libro.getEditorial());
		existente.setFechaPublicacion(libro.getFechaPublicacion());
		existente.setAutor(libro.getAutor());
		existente.setNumeroPagina(libro.getNumeroPagina());
		existente.setGenero(libro.getGenero());
		existente.setIdioma(libro.getIdioma());
	
		return libroRepo.save(existente);
	}



}
