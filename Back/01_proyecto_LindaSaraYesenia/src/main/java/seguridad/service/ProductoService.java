package seguridad.service;

import java.util.List;

import seguridad.model.Libro;
import seguridad.model.Papeleria;
import seguridad.model.Producto;

public interface ProductoService {
	
	List<Producto> findAll();
	
	Producto findOne(Integer idproducto);
	int deleteById (Integer idProducto);
	
	List<Producto> buscardorProducto (String texto);

	List<Producto> filtrar(String tipo, String idioma, String genero, String marca, String categoria, Double precio, String estado);

}
