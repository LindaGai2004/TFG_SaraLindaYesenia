package seguridad.service;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;
import seguridad.model.Libro;
import seguridad.model.Papeleria;
import seguridad.model.Producto;
import seguridad.repository.LibroRepository;
import seguridad.repository.PapeleriaRespository;
import seguridad.repository.ProductoRepository;

@Service
public class ProductoServiceImpl implements ProductoService {

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
            } catch (Exception e) {
                return 0;
            }
        } else {
            return -1;
        }
    }

    @Override
    public Producto getProductoDestacado() {
        return productoRepository.findByDestacadoTrue()
                .orElseThrow(() -> new RuntimeException("No hay producto destacado"));
    }

    @Override
    @Transactional
    public Producto escogerDestacado(Integer idProducto) {
        Producto nuevo = productoRepository.findById(idProducto)
                .orElseThrow(() -> new RuntimeException("No existe el producto"));

        if (!(nuevo instanceof Libro)) {
            throw new RuntimeException("Solo se puede destacar libros");
        }
        Optional<Producto> actual = productoRepository.findByDestacadoTrue();
        if (actual.isPresent()) {
            Producto anterior = actual.get();
            anterior.setDestacado(false);
            productoRepository.save(anterior);
        }
        nuevo.setDestacado(true);
        productoRepository.save(nuevo);
        return nuevo;
    }

    @Override
    public List<Producto> buscardorProducto(String texto) {
        List<Producto> porNombreProductos = productoRepository.findByNombreProductoContainingIgnoreCase(texto);

        // Libros
        List<Libro> porAutor = libroRepo.findByAutorContainingIgnoreCase(texto);
        List<Libro> porIsbn = libroRepo.findByISBNContaining(texto);
        List<Libro> porEditorial = libroRepo.findByEditorialContainingIgnoreCase(texto);

        // Papelerías
        List<Papeleria> porMarca = papeleriaRepo.findByMarcaNombreMarcaContainingIgnoreCase(texto);

        Set<Producto> resultado = new HashSet<>();
        resultado.addAll(porMarca);
        resultado.addAll(porNombreProductos);
        resultado.addAll(porEditorial);
        resultado.addAll(porIsbn);
        resultado.addAll(porAutor);

        return new ArrayList<>(resultado);
    }

    @Override
    public List<Producto> filtrar(String tipo, String idioma, String genero,
                                  String marca, String categoria,
                                  Double precioMin, Double precioMax,
                                  String estado) {

        List<Producto> resultado = new ArrayList<>();

        boolean filtrarLibros = "libro".equalsIgnoreCase(tipo);
        boolean filtrarPapeleria = "papeleria".equalsIgnoreCase(tipo);

        if (!filtrarLibros && !filtrarPapeleria) {
            resultado.addAll(productoRepository.findAll());
        }

        if (filtrarLibros) {
            resultado.addAll(libroRepo.findAll());
        }

        if (filtrarPapeleria) {
            resultado.addAll(papeleriaRepo.findAll());
        }

        if (precioMin != null && precioMax != null) {
            resultado.removeIf(p -> p.getPrecio() < precioMin || p.getPrecio() > precioMax);
        }

        if (estado != null && !estado.isEmpty()) {
            resultado.removeIf(p -> !p.getEstadoProducto().name().equalsIgnoreCase(estado));
        }

        if (filtrarLibros) {

            if (idioma != null && !idioma.isEmpty()) {
                resultado.removeIf(p -> !(p instanceof Libro) ||
                        ((Libro) p).getIdioma() == null ||
                        !((Libro) p).getIdioma().getNombreIdioma().equalsIgnoreCase(idioma));
            }

            if (genero != null && !genero.isEmpty()) {
                resultado.removeIf(p -> !(p instanceof Libro) ||
                        ((Libro) p).getGenero() == null ||
                        !((Libro) p).getGenero().getNombreGenero().equalsIgnoreCase(genero));
            }
        }

        if (filtrarPapeleria) {

            if (marca != null && !marca.isEmpty()) {
                resultado.removeIf(p -> !(p instanceof Papeleria) ||
                        ((Papeleria) p).getMarca() == null ||
                        !((Papeleria) p).getMarca().getNombreMarca().equalsIgnoreCase(marca));
            }

            if (categoria != null && !categoria.isEmpty()) {
                resultado.removeIf(p -> !(p instanceof Papeleria) ||
                        ((Papeleria) p).getCategoria() == null ||
                        !((Papeleria) p).getCategoria().getNombreCategoria().equalsIgnoreCase(categoria));
            }
        }

        return resultado;
    }

    // PRODUCTOS RELACIONADOS PARA LIBROS
    @Override
    public List<Producto> relacionadosLibro(String autor, String genero, Integer idActual) {

        List<Libro> porAutor = libroRepo.findByAutorContainingIgnoreCase(autor);
        List<Libro> porGenero = libroRepo.findByGeneroNombreGeneroIgnoreCase(genero);

        Set<Producto> resultado = new HashSet<>();
        resultado.addAll(porAutor);
        resultado.addAll(porGenero);

        // Excluir el producto actual
        resultado.removeIf(p -> p.getIdProducto().equals(idActual));

        return new ArrayList<>(resultado);
    }

    // PRODUCTOS RELACIONADOS PARA PAPELERÍA
    @Override
    public List<Producto> relacionadosPapeleria(String marca, String categoria, Integer idActual) {

        List<Papeleria> porMarca = papeleriaRepo.findByMarcaNombreMarcaContainingIgnoreCase(marca);
        List<Papeleria> porCategoria = papeleriaRepo.findByCategoriaNombreCategoriaIgnoreCase(categoria);

        Set<Producto> resultado = new HashSet<>();
        resultado.addAll(porMarca);
        resultado.addAll(porCategoria);

        // Excluir el producto actual
        resultado.removeIf(p -> p.getIdProducto().equals(idActual));

        return new ArrayList<>(resultado);
    }

}