package seguridad.service;

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
		List<Papeleria> poeMarca = papeleriaRepo.findByMarcaNombreMarcaContainingIgnoreCase(texto);
		
		
		Set<Producto> resultado = new HashSet<>();
		resultado.addAll(poeMarca);
		resultado.addAll(porNombreProductos);
		resultado.addAll(porEditorial);
		resultado.addAll(porIsbn);
		resultado.addAll(porAutor);
		
		return new ArrayList<>(resultado);
	}
	
	
	@Override
	public List<Producto> filtrar(String tipo, String idioma, String genero,
	                              String marca, String categoria, Double precio, String estado) {

	    List<Producto> resultado = new ArrayList<>();

	    boolean filtrarLibros = "libro".equalsIgnoreCase(tipo);
	    boolean filtrarPapeleria = "papeleria".equalsIgnoreCase(tipo);

	    // Si NO hay tipo, cargamos TODOS los productos
	    if (!filtrarLibros && !filtrarPapeleria) {
	        resultado.addAll(productoRepository.findAll());
	    }

	    // Si hay tipo libro, cargamos solo libros
	    if (filtrarLibros) {
	        resultado.addAll(libroRepo.findAll());
	    }

	    // Si hay tipo papelería, cargamos solo papelería
	    if (filtrarPapeleria) {
	        resultado.addAll(papeleriaRepo.findAll());
	    }

	    // FILTROS COMUNES (se aplican SIEMPRE)
	    if (precio != null) {
	        resultado.removeIf(p -> p.getPrecio() > precio);
	    }

	    if (estado != null && !estado.isEmpty()) {
	        resultado.removeIf(p -> !p.getEstadoProducto().name().equalsIgnoreCase(estado));
	    }

	    // FILTROS PARA LIBROS
	    if (filtrarLibros) {

	        if (idioma != null && !idioma.isEmpty()) {
	            resultado.removeIf(p -> !(p instanceof Libro) ||
	                    ((Libro)p).getIdioma() == null ||
	                    !((Libro)p).getIdioma().getNombreIdioma().equalsIgnoreCase(idioma));
	        }

	        if (genero != null && !genero.isEmpty()) {
	            resultado.removeIf(p -> !(p instanceof Libro) ||
	                    ((Libro)p).getGenero() == null ||
	                    !((Libro)p).getGenero().getNombreGenero().equalsIgnoreCase(genero));
	        }
	    }

	    // FILTROS PARA PAPELERÍA
	    if (filtrarPapeleria) {

	        if (marca != null && !marca.isEmpty()) {
	            resultado.removeIf(p -> !(p instanceof Papeleria) ||
	                    ((Papeleria)p).getMarca() == null ||
	                    !((Papeleria)p).getMarca().getNombreMarca().equalsIgnoreCase(marca));
	        }

	        if (categoria != null && !categoria.isEmpty()) {
	            resultado.removeIf(p -> !(p instanceof Papeleria) ||
	                    ((Papeleria)p).getCategoria() == null ||
	                    !((Papeleria)p).getCategoria().getNombreCategoria().equalsIgnoreCase(categoria));
	        }
	    }

	    return resultado;
	}


}
