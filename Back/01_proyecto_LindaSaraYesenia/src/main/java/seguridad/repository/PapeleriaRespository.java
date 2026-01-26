package seguridad.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import seguridad.model.Papeleria;

public interface PapeleriaRespository extends JpaRepository<Papeleria, Integer>{
	List<Papeleria> findByNombreProductoContainingIgnoreCase (String nombreProducto);
	List<Papeleria> findByMarcaNombreMarcaContainingIgnoreCase(String marca);
}
