package seguridad.service;

import java.util.List;

import seguridad.model.Papeleria;

public interface PapeleriaService {
	
	List<Papeleria> findAll();

	Papeleria findOne (Integer idProducto);

	Papeleria insertPapeleria(Papeleria papeleria);

	Papeleria updatePapeleria(Papeleria papeleria);
	
	List<Papeleria> buscardorPapeleria (String texto);

}
