package seguridad.service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import seguridad.model.Libro;
import seguridad.model.Papeleria;
import seguridad.model.Producto;
import seguridad.repository.LibroRepository;
import seguridad.repository.PapeleriaRespository;
import seguridad.repository.ProductoRepository;

@Service
public class ProductoServiceImpl implements ProductoService{

	@Autowired
	private ProductoRepository productoRepository;
	@Autowired
	private LibroRepository libroRepo;
	@Autowired
	private PapeleriaRespository papeleriaRepo;
	
	
	@Override
	public List<Producto> findAll() {
		return productoRepository.findAll();
	}


	@Override
	public Producto findOne(Integer idproducto) {
		return productoRepository.findById(idproducto).orElseThrow();
	}

	@Override
	public int deleteById(Integer idProducto) {
		if (findOne(idProducto) != null) {
			try {
				productoRepository.deleteById(idProducto);
				return 1;
			}catch (Exception e) {
				return 0;
			}
		}else {
			return -1;
		}
	}


	@Override
	public List<Producto> buscardorProducto(String texto) {
		List<Producto> porNombreProductos = productoRepository.findByNombreProductoContainingIgnoreCase(texto);
		//Libros
		List<Libro> porAutor = libroRepo.findByAutorContainingIgnoreCase(texto);
		List<Libro> porIsbn = libroRepo.findByISBNContaining(texto);
		List<Libro> porEditorial = libroRepo.findByEditorialContainingIgnoreCase(texto);
		
		//papelerias
		List<Papeleria> poeMarca = papeleriaRepo.findByMarcaMarcaPapeleriaContainingIgnoreCase(texto);
		
		
		Set<Producto> resultado = new HashSet<>();
		resultado.addAll(poeMarca);
		resultado.addAll(porNombreProductos);
		resultado.addAll(porEditorial);
		resultado.addAll(porIsbn);
		resultado.addAll(porAutor);
		
		return new ArrayList<>(resultado);
	}



	
	

}
