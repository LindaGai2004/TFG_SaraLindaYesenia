package seguridad.service;

import java.util.List;

import org.springframework.stereotype.Service;


import seguridad.model.Producto;
@Service
public interface ProductoService {
	
	List<Producto> findAll();
	

	Producto findOne(Integer idProducto);
	int deleteById (Integer idProducto);

	//Para mostrar el producto destacado en Home
	Producto getProductoDestacado();
	//Para que el admon pueda escoger en su dashboard
	Producto escogerDestacado(Integer idProducto);
	
	List<Producto> buscardorProducto (String texto);
	List<Producto> filtrar(String tipo, String idioma, String genero, String marca, String categoria, Double precio, String estado);

}
