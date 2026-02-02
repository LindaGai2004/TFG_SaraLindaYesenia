package seguridad.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import seguridad.model.Libro;
import seguridad.model.Papeleria;
import seguridad.model.Producto;
import seguridad.repository.ProductoRepository;
@Service
public interface ProductoService {
	
	List<Producto> findAll();
	
	Producto findOne(Integer idProducto);
	int deleteById (Integer idProducto);
	
	//Para mostrar el producto destacado en Home
	Producto getProductoDestacado();
	//Para que el admon pueda escoger en su dashboard
	Producto escogerDestacado(Integer idProducto);
	

}
