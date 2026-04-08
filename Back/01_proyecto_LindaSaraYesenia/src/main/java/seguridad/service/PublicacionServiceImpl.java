package seguridad.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import seguridad.model.ComentarioPublicacion;
import seguridad.model.LikePublicacion;
import seguridad.model.Publicacion;
import seguridad.model.Usuario;
import seguridad.model.dto.ComentarioDto;
import seguridad.model.dto.PublicacionDto;
import seguridad.repository.ComentarioPublicacionRepository;
import seguridad.repository.LikePublicacionRepository;
import seguridad.repository.PublicacionRepository;
import seguridad.repository.UsuarioRepository;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Optional;

@Service
public class PublicacionServiceImpl implements PublicacionService {

    @Autowired
    private PublicacionRepository publicacionRepo;
    
    @Autowired
    private UsuarioRepository usuarioRepo;
    
    @Autowired
    private LikePublicacionRepository likeRepo;

    @Autowired
    private ComentarioPublicacionRepository comentarioRepo;
    
    
    private Integer obtenerIdUsuarioActual() {
        var auth = SecurityContextHolder.getContext().getAuthentication();

        if (auth == null || !auth.isAuthenticated() || auth.getName().equals("anonymousUser")) {
            return null;
        }

        String email = auth.getName();
        Optional<Usuario> u = usuarioRepo.findByEmail(email);

        return u.map(Usuario::getIdUsuario).orElse(null);
    }



    @Override
    public List<PublicacionDto> obtenerPublicaciones() {
        return publicacionRepo.findAllByOrderByFechaDesc()
                .stream()
                .map(this::mapToDto)
                .toList();
    }

    @Override
    public List<PublicacionDto> obtenerPublicacionesPorUsuario(Integer idUsuario) {
        return publicacionRepo.findByUsuarioIdUsuarioOrderByFechaDesc(idUsuario)
                .stream()
                .map(this::mapToDto)
                .toList();
    }

    @Override
    public Publicacion crearPublicacion(Usuario usuario, String texto, String imagen) {
        Publicacion p = new Publicacion();
        p.setUsuario(usuario);
        p.setTexto(texto);
        p.setImagen(imagen);

        return publicacionRepo.save(p);
    }

    @Override
    public Publicacion obtenerPorId(Integer id) {
        return publicacionRepo.findById(id).orElse(null);
    }

    @Override
    public void eliminarPublicacion(Integer id) {
        publicacionRepo.deleteById(id);
    }

    // mapper
    public PublicacionDto mapToDto(Publicacion p) {

        PublicacionDto dto = new PublicacionDto();

        dto.setIdPublicacion(p.getId());
        dto.setTexto(p.getTexto());
        dto.setImagen(p.getImagen());
        dto.setUsuarioNombre(p.getUsuario().getNombre());
        dto.setUsuarioAvatar(p.getUsuario().getAvatar());
        dto.setFecha(formatearFecha(p.getFecha()));

        // Likes reales
        Integer likes = likeRepo.countByPublicacion_Id(p.getId());
        dto.setLikes(likes == null ? 0 : likes);

        // Comentarios reales
        Integer comentarios = comentarioRepo.countByPublicacion_Id(p.getId());
        dto.setComentarios(comentarios == null ? 0 : comentarios);

        // Saber si el usuario actual ya dio like
        Integer idUsuarioActual = obtenerIdUsuarioActual();

        boolean likedByUser = false;

        if (idUsuarioActual != null) {
            likedByUser = likeRepo
                    .findByPublicacion_IdAndUsuario_IdUsuario(p.getId(), idUsuarioActual)
                    .isPresent();
        }

        dto.setLikedByUser(likedByUser);



        // Lista de comentarios
        dto.setListaComentarios(
            comentarioRepo.findByPublicacion_IdOrderByFechaDesc(p.getId())
                .stream()
                .map(c -> new ComentarioDto(
                        c.getUsuario().getNombre(),
                        c.getTexto(),
                        formatearFecha(c.getFecha())
                ))
                .toList()
        );

        return dto;
    }

    
    private String formatearFecha(LocalDateTime fecha) {
        LocalDateTime ahora = LocalDateTime.now();

        long minutos = ChronoUnit.MINUTES.between(fecha, ahora);
        long horas = ChronoUnit.HOURS.between(fecha, ahora);
        long dias = ChronoUnit.DAYS.between(fecha, ahora);

        if (minutos < 1) return "Justo ahora";
        if (minutos < 60) return "Hace " + minutos + " min";
        if (horas < 24) return "Hace " + horas + " horas";
        if (dias == 1) return "Ayer";
        return "Hace " + dias + " días";
    }
    
    
    // Likes de la publicación
    @Override
    public boolean toggleLike(Integer idPublicacion, Integer idUsuario) {
        Optional<LikePublicacion> existing = likeRepo.findByPublicacion_IdAndUsuario_IdUsuario(idPublicacion, idUsuario);

        if (existing.isPresent()) {
            likeRepo.delete(existing.get());
            return false; // like eliminado
        }

        LikePublicacion like = new LikePublicacion();
        like.setPublicacion(publicacionRepo.findById(idPublicacion).orElseThrow());
        like.setUsuario(usuarioRepo.findById(idUsuario).orElseThrow());
        likeRepo.save(like);

        return true; // like añadido
    }

    
    // Agregar comentarios a la publicación
    @Override
    public void agregarComentario(Integer idPublicacion, Integer idUsuario, String texto) {
        ComentarioPublicacion c = new ComentarioPublicacion();
        c.setPublicacion(publicacionRepo.findById(idPublicacion).orElseThrow());
        c.setUsuario(usuarioRepo.findById(idUsuario).orElseThrow());
        c.setTexto(texto);

        comentarioRepo.save(c);
    }

}