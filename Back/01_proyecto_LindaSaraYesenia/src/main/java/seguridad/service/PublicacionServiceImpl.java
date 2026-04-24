package seguridad.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;
import seguridad.model.ComentarioPublicacion;
import seguridad.model.Libro;
import seguridad.model.LikePublicacion;
import seguridad.model.Papeleria;
import seguridad.model.Publicacion;
import seguridad.model.Seguidor;
import seguridad.model.Usuario;
import seguridad.model.dto.ComentarioDto;
import seguridad.model.dto.PublicacionDto;
import seguridad.repository.ComentarioPublicacionRepository;
import seguridad.repository.LikePublicacionRepository;
import seguridad.repository.ProductoRepository;
import seguridad.repository.PublicacionRepository;
import seguridad.repository.SeguidorRepository;
import seguridad.repository.UsuarioRepository;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
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
    
    @Autowired
    private ProductoRepository productoRepo;
    
    @Autowired
    private SeguidorRepository seguidorRepo;
    
    
    private Integer obtenerIdUsuarioActual() {
        var auth = SecurityContextHolder.getContext().getAuthentication();

        // verifica si no hay una sesión activa o si el usuario ha accedido de forma anónima sin loguearse
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

    
    // Crear publicación
    @Override
    public Publicacion crearPublicacion(Usuario usuario, String texto, String imagen, Integer idProducto) {
        Publicacion p = new Publicacion();
        p.setUsuario(usuario);
        p.setTexto(texto);
        p.setImagen(imagen);
        
        // Buscael producto y asignarlo
        if (idProducto != null) {
            productoRepo.findById(idProducto).ifPresent(prod -> {
                p.setProducto(prod);
            });
        }

        return publicacionRepo.save(p);
    }

    
    @Override
    public Publicacion obtenerPorId(Integer id) {
        return publicacionRepo.findById(id).orElse(null);
    }

    
    // Eliminar publicación
    @Override
    public void eliminarPublicacion(Integer id) {
        Publicacion pub = publicacionRepo.findById(id).orElse(null);
        if (pub != null) {
            // Borra el archivo físico si tiene imagen
            if (pub.getImagen() != null) {
                try {
                    // Extraemos el nombre del archivo de la ruta "/uploads/publicaciones/nombre.jpg"
                    String nombreImagen = pub.getImagen().substring(pub.getImagen().lastIndexOf("/") + 1);
                    Path ruta = Paths.get("C:/Users/saray/Documents/TFG_SaraLindaYesenia/Back/01_proyecto_LindaSaraYesenia/upload/publicaciones/" + nombreImagen);
                    Files.deleteIfExists(ruta);
                } catch (Exception e) {
                    System.err.println("No se pudo borrar el archivo físico: " + e.getMessage());
                }
            }
            // Borra de la base de datos
            publicacionRepo.deleteById(id);
        }
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

        if (p.getProducto() != null) {
            dto.setIdProducto(p.getProducto().getIdProducto());
            dto.setNombreProducto(p.getProducto().getNombreProducto());
            dto.setPrecioProducto(p.getProducto().getPrecio());

            if (p.getProducto() instanceof Libro) {
                dto.setTipoProducto("LIBRO");
            } else if (p.getProducto() instanceof Papeleria) {
                dto.setTipoProducto("PAPELERIA");
            }

            if (p.getProducto().getImagenes() != null && !p.getProducto().getImagenes().isEmpty()) {
                dto.setImagenProducto(p.getProducto().getImagenes().get(0).getRuta());
            }
        }
        
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

    
    // Formatear la fecha en la que se ha realizado la publicaicon
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
    
    
    // Seguir usuarios
    @Override
    @Transactional
    public boolean toggleSeguir(Integer idSeguidor, Integer idSeguido) {
        // Evitar que alguien se siga a sí mismo
        if (idSeguidor.equals(idSeguido)) {
            throw new RuntimeException("No puedes seguirte a ti mismo");
        }

        // Buscar a ambos usuarios
        Usuario seguidor = usuarioRepo.findById(idSeguidor)
                .orElseThrow(() -> new RuntimeException("Usuario seguidor no encontrado"));
        Usuario seguido = usuarioRepo.findById(idSeguido)
                .orElseThrow(() -> new RuntimeException("Usuario a seguir no encontrado"));

        // Comprobar si ya existe la relación en la tabla 'seguidores'
        Optional<Seguidor> existe = seguidorRepo.findBySeguidorAndSeguido(seguidor, seguido);

        if (existe.isPresent()) {
            // Si existe, lo borramos (dejar de seguir)
            seguidorRepo.delete(existe.get());
            return false; // Devolvemos false porque ya no le sigue
        } else {
            // Si no existe, lo creamos (sigue)
            Seguidor nuevoSeguimiento = new Seguidor();
            nuevoSeguimiento.setSeguidor(seguidor);
            nuevoSeguimiento.setSeguido(seguido);
            nuevoSeguimiento.setFechaSeguimiento(LocalDateTime.now());
            
            seguidorRepo.save(nuevoSeguimiento);
            return true; // Devolvemos true porque ahora sí le sigue
        }
    }

}