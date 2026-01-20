package seguridad.service;

import java.util.List;

import seguridad.model.Libro;
import seguridad.model.Papeleria;
import seguridad.model.Producto;

public interface ProductoService {
	
	List<Producto> findAll();
	
	Producto findOne(Integer idproducto);
	int deleteById (Integer idProducto);
	
	

}
