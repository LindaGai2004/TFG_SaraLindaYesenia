package seguridad.service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import seguridad.model.Papeleria;
import seguridad.repository.PapeleriaRespository;

@Service
public class PapeleriaServiceImpl implements PapeleriaService {

    @Autowired
    private PapeleriaRespository papeleriaRepo;

    @Override
    public List<Papeleria> findAll() {
        return papeleriaRepo.findAll();
    }

    @Override
    public Papeleria findOne(Integer idProducto) {
        return papeleriaRepo.findById(idProducto).orElseThrow();
    }

    @Override
    public Papeleria insertPapeleria(Papeleria papeleria) {
        papeleria.setFechaAlta(LocalDate.now());
        return papeleriaRepo.save(papeleria);
    }

    @Override
    public Papeleria updatePapeleria(Papeleria papeleria) {

        Papeleria existente = findOne(papeleria.getIdProducto());

        if (existente != null) {

            // Campos heredados de Producto
            existente.setNombreProducto(papeleria.getNombreProducto());
            existente.setDescripcion(papeleria.getDescripcion());
            existente.setPrecio(papeleria.getPrecio());
            existente.setStock(papeleria.getStock());
            existente.setEstadoProducto(papeleria.getEstadoProducto());

            if (papeleria.getFechaAlta() != null) {
                existente.setFechaAlta(papeleria.getFechaAlta());
            }

            existente.setCostoReal(papeleria.getCostoReal());

            // Campos propios de Papelería
            existente.setMarca(papeleria.getMarca());
            existente.setCategoria(papeleria.getCategoria());
            existente.setDescripcionLarga(papeleria.getDescripcionLarga());

            return papeleriaRepo.save(existente);
        } else {
            return null;
        }
    }

    @Override
    public List<Papeleria> buscardorPapeleria(String texto) {
        List<Papeleria> porNombreProducto = papeleriaRepo.findByNombreProductoContainingIgnoreCase(texto);
        List<Papeleria> porMarca = papeleriaRepo.findByMarcaNombreMarcaContainingIgnoreCase(texto);

        Set<Papeleria> resultado = new HashSet<>();
        resultado.addAll(porNombreProducto);
        resultado.addAll(porMarca);

        return new ArrayList<>(resultado);
    }
}
