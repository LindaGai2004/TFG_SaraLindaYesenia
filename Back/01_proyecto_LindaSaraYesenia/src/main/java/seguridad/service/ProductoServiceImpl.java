package seguridad.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import seguridad.model.Producto;
import seguridad.repository.ProductoRepository;

@Service
public class ProductoServiceImpl implements ProductoService{

	@Autowired
	private ProductoRepository productoRepository;
	
	
	@Override
	public List<Producto> findAll() {
		return productoRepository.findAll();
	}


	@Override
	public Producto findOne(Integer idproducto) {
		// TODO Auto-generated method stub
		return productoRepository.findById(idproducto).orElseThrow();
	}

	@Override
	public Producto insertarProducto(Producto producto) {
			
			try {
				return productoRepository.save(producto);
			} catch (Exception e) {
				throw new RuntimeException("Error al insertar producto: " + e.getMessage());
			}
			
	}


	@Override
	public Producto updateProducto(Producto producto) {
		
		
		 Producto existente = productoRepository.findById(producto.getIdProducto())
			      	.orElseThrow(() -> new RuntimeException("Producto no encontrado"));
		 
		 existente.setNombreLibro(producto.getNombreLibro());
		 existente.setCostoReal(producto.getCostoReal());
		 existente.setDescripcion(producto.getDescripcion());
		 existente.setEstado(producto.getEstado());
		 existente.setFechaAlta(producto.getFechaAlta());
		 existente.setPrecio(producto.getPrecio());
		 existente.setStock(producto.getStock());
		 existente.setTipoProducto(producto.getTipoProducto());
		 
		 return productoRepository.save(existente);
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


	
	

}
