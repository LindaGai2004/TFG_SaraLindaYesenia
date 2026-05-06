package seguridad.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import seguridad.model.Seguidor;
import seguridad.model.Usuario;
import seguridad.model.dto.SeguidorDto;
import seguridad.repository.SeguidorRepository;
import seguridad.repository.UsuarioRepository;
@Service
public class SeguidorServiceImpl implements SeguidorService{

	@Autowired
    private SeguidorRepository seguidorRepo;

    @Autowired
    private UsuarioRepository usuarioRepo;

    @Override
    public List<SeguidorDto> getSeguidores(Integer idUsuario) {
        Usuario yo = usuarioRepo.findById(idUsuario).orElseThrow();

        Set<Integer> misSeguidosIds = seguidorRepo.findBySeguidor(yo)
                .stream()
                .map(s -> s.getSeguido().getIdUsuario())
                .collect(Collectors.toSet());

        return seguidorRepo.findBySeguido(yo).stream()
                .map(s -> {
                    Usuario u = s.getSeguidor();
                    return new SeguidorDto(
                        u.getIdUsuario(),
                        u.getNombre(),
                        u.getApellidos(),
                        u.getUsername(),
                        u.getEmail(),
                        u.getAvatar(),
                        misSeguidosIds.contains(u.getIdUsuario())
                    );
                })
                .collect(Collectors.toList());
    }

    @Override
    public List<SeguidorDto> getSeguidos(Integer idUsuario) {
        Usuario yo = usuarioRepo.findById(idUsuario).orElseThrow();

        return seguidorRepo.findBySeguidor(yo).stream()
                .map(s -> {
                    Usuario u = s.getSeguido();
                    return new SeguidorDto(
                        u.getIdUsuario(),
                        u.getNombre(),
                        u.getApellidos(),
                        u.getUsername(),
                        u.getEmail(),
                        u.getAvatar(),
                        true
                    );
                })
                .collect(Collectors.toList());
    }

    @Override
    public Map<String, Object> toggleSeguir(Integer idSeguidor, Integer idSeguido) {
        Usuario seguidor = usuarioRepo.findById(idSeguidor).orElseThrow();
        Usuario seguido  = usuarioRepo.findById(idSeguido).orElseThrow();

        Optional<Seguidor> existing = seguidorRepo.findBySeguidorAndSeguido(seguidor, seguido);
        Map<String, Object> result = new HashMap<>();

        if (existing.isPresent()) {
            seguidorRepo.delete(existing.get());
            result.put("siguiendo", false);
        } else {
            Seguidor nuevo = new Seguidor();
            nuevo.setSeguidor(seguidor);
            nuevo.setSeguido(seguido);
            seguidorRepo.save(nuevo);
            result.put("siguiendo", true);
        }
        return result;
    }

}
