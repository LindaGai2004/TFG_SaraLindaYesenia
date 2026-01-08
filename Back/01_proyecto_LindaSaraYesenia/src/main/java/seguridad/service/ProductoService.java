package seguridad.service;

import java.util.List;

import seguridad.model.Producto;

public interface ProductoService {
	
	List<Producto> findAll();
	
	Producto findOne(Integer idproducto);
	Producto insertarProducto(Producto producto);
	Producto updateProducto(Producto producto);
	int deleteById (Integer idProducto);
	
	

}
