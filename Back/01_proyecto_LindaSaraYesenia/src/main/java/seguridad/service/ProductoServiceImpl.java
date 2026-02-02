package seguridad.service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;
import seguridad.model.Libro;
import seguridad.model.Papeleria;
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
	public Producto getProductoDestacado() {
		return productoRepository.libroDestacado()
				.orElseThrow(()-> new RuntimeException("No hay producto destacado"));
	}


	@Override
	@Transactional
	public Producto escogerDestacado(Integer idProducto) {
		Producto nuevo = productoRepository.findById(idProducto)
				.orElseThrow(()-> new RuntimeException("No existe el producto"));
		
		Optional<Producto> actual= productoRepository.libroDestacado();
		if (actual.isPresent()) {
			Producto anterior = actual.get();
			anterior.setDestacado(false);
			productoRepository.save(anterior);
		}
		nuevo.setDestacado(true);
		productoRepository.save(nuevo);
		return nuevo;
	}



	
	

}
