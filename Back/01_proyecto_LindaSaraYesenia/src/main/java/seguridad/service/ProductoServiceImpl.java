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
	public List<Producto> filtrar(String tipo, String idioma, String genero, String marca, String categoria, Double precio, String estado) {

		System.out.println("---- FILTROS RECIBIDOS ----");
		System.out.println("tipo = " + tipo);
		System.out.println("idioma = " + idioma);
		System.out.println("genero = " + genero);
		System.out.println("marca = " + marca);
		System.out.println("categoria = " + categoria);
		System.out.println("precio = " + precio);
		System.out.println("estado = " + estado);
		System.out.println("----------------------------");

		
	    List<Producto> resultado = new ArrayList<>();

	    boolean filtrarLibros = "libro".equalsIgnoreCase(tipo);
	    boolean filtrarPapeleria = "papeleria".equalsIgnoreCase(tipo);

	    // SI NO HAY TIPO → DEVOLVER TODOS
	    if (!filtrarLibros && !filtrarPapeleria) {
	        return productoRepository.findAll();
	    }

	    // FILTRO PARA LIBROS
	    if (filtrarLibros) {

	        List<Libro> libros = libroRepo.findAll();

	        if (idioma != null && !idioma.isEmpty()) {
	            libros.removeIf(l -> l.getIdioma() == null ||
	                    !l.getIdioma().getNombreIdioma().equalsIgnoreCase(idioma));
	        }

	        if (genero != null && !genero.isEmpty()) {
	            libros.removeIf(l -> l.getGenero() == null ||
	                    !l.getGenero().getNombreGenero().equalsIgnoreCase(genero));
	        }

	        if (precio != null) {
	            libros.removeIf(l -> l.getPrecio() > precio);
	        }

	        if (estado != null && !estado.isEmpty()) {
	            libros.removeIf(l -> !l.getEstadoProducto().name().equalsIgnoreCase(estado));
	        }

	        resultado.addAll(libros);
	    }

	    // FILTRO PARA PAPELERÍA
	    if (filtrarPapeleria) {

	        List<Papeleria> pap = papeleriaRepo.findAll();

	        if (marca != null && !marca.isEmpty()) {
	            pap.removeIf(p -> p.getMarca() == null ||
	                    !p.getMarca().getNombreMarca().equalsIgnoreCase(marca));
	        }

	        if (categoria != null && !categoria.isEmpty()) {
	            pap.removeIf(p -> p.getCategoria() == null ||
	                    !p.getCategoria().getNombreCategoria().equalsIgnoreCase(categoria));
	        }

	        if (precio != null) {
	            pap.removeIf(p -> p.getPrecio() > precio);
	        }

	        if (estado != null && !estado.isEmpty()) {
	            pap.removeIf(p -> !p.getEstadoProducto().name().equalsIgnoreCase(estado));
	        }

	        resultado.addAll(pap);
	    }

	    return resultado;
	}

}
