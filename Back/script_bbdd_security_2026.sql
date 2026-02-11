create database tfg_2026;
use tfg_2026;

create table perfiles( 
	id_perfil int not null auto_increment primary key,
	nombre varchar(250) not null
);

create table usuarios(
	id_usuario int auto_increment primary key,
	username varchar(45) not null,
	password varchar(250) not null,
	nombre varchar(100),
	apellidos varchar(200),
	enabled int,
	fecha_registro date,
    fecha_nacimiento date,
    direccion varchar(200),
    email varchar(45) not null unique,
	id_perfil int,
    foreign key (id_perfil) references perfiles(id_perfil)
);

create table pedidos(
	id_pedido int auto_increment primary key,
    fecha_venta date,
    estado_pedido ENUM ('CARRITO','REALIZADO','CANCELADO','DEVUELTO'),
    total DECIMAL(12,2) NOT NULL,
    id_usuario int,
    foreign key (id_usuario) references usuarios(id_usuario)
);


CREATE TABLE genero (
	id_genero int auto_increment primary key not null,
    nombre_genero varchar(100) not null
);


CREATE TABLE categoria(
	id_categoria int auto_increment primary key not null,
	nombre_categoria varchar(100) not null
);


CREATE TABLE productos (
    id_producto int not null auto_increment primary key,
    nombre_producto varchar(100) not null,
    descripcion varchar(500),
    tipo_producto ENUM ('LIBRO', 'PAPELERIA') not null,
    precio DECIMAL(10,2) not null,
    stock int not null,
    estado_producto ENUM('DISPONIBLE', 'AGOTADO') not null,
    fecha_alta date not null,
    costo_real double not null,
	destacado boolean default false
);

CREATE TABLE idioma(
	id_idioma int auto_increment primary key not null,
	nombre_idioma varchar(50) not null
);

create table libros(
    id_producto int not null primary key,
    ISBN VARCHAR(13) not null,
    editorial varchar(50),
    fecha_publicacion date not null,
    autor varchar(100) not null,
    numero_paginas int not null,
    resumen VARCHAR(1000),
    id_genero int,
    id_idioma int,
    foreign key (id_genero) references genero (id_genero),  
    foreign key (id_producto) references productos(id_producto),
    foreign key (id_idioma) references idioma(id_idioma)
);


CREATE TABLE marca(
	id_marca int auto_increment not null primary key,
	nombre_marca varchar(100) not null
);


CREATE TABLE papeleria (
	id_producto int primary key not null,
	id_marca int ,
    id_categoria int,
    foreign key (id_categoria) references categoria(id_categoria),
    foreign key (id_producto) references productos(id_producto),
    foreign key (id_marca) references marca(id_marca)
);

create table detalle_pedido(
	id_detalle_pedido int primary key auto_increment not null,
	id_pedido int not null,
    id_producto int not null,
    cantidad int not null,
    precio_unidad dec(12,2) not null,
    foreign key (id_pedido) references pedidos(id_pedido),
    foreign key (id_producto) references productos(id_producto),
    unique (id_pedido, id_producto)
);

create table facturas(
	id_factura int auto_increment primary key,
    num_factura varchar(15) not null,
    fecha_factura date not null,
    precio_total dec(15,2) not null,
    id_pedido int,
    foreign key (id_pedido) references pedidos( id_pedido)
);


INSERT INTO perfiles(nombre)
values ('ROLE_ADMON'),('ROLE_CLIENTE'),
('ROLE_TRABAJADOR'),
('ROLE_JEFE');


INSERT INTO usuarios (username, password, nombre, apellidos, enabled, fecha_registro, fecha_nacimiento, direccion, email, id_perfil)values
('tomas', '{noop}tomasin', 'Tomas', 'Escu',1,'2025-11-05','1960-11-02','madrid', 'tomas@ifp.com',1),
('sarita', '{noop}sarita', 'Sara', 'Baras',2,'2024-02-05','1999-03-16','sevilla', 'sara@ifp.com',2),
('eva', '{noop}evita', 'Eva', 'Goma',1,'2000-01-02','1978-05-24','cordoba', 'eva@ifp.com',3),
('ramon', '{noop}ramoncin', 'Ramon', 'González',1,'2014-07-07','1996-06-04','madrid','ramon@ifp.com', 4);


INSERT INTO pedidos (fecha_venta, estado_pedido, total, id_usuario) VALUES
('2024-01-15','REALIZADO',72.48,1),
('2024-02-20','REALIZADO',53.50,2),
('2024-03-10','REALIZADO',46.20,1),
('2024-04-05','CANCELADO',0.00,2),
('2024-05-12','REALIZADO',27.55,1),
('2024-06-18','REALIZADO',32.45,2),
('2024-07-22','DEVUELTO',98.11,3),
('2024-08-30','REALIZADO',67.12,4),
('2024-09-15','REALIZADO',38.92,1),
('2024-12-10','CANCELADO',23.55,2);


INSERT INTO genero (nombre_genero)VALUES
('Arquitectura y diseño'),
('Poesía'),
('Novela'),
('Teatro'),
('Ciencia ficción'),
('Fantasía'),
('Histórico'),
('Infantil'),
('Juvenil'),
('Misterio'),
('Romance'),
('Aventura'),
('Religión'),
('Clásicos'),
('Terror'),
('Viajes'),
('Arte'),
('Música'),
('Educación'),
('Cocina'),
('Informática'),
('Cómic'),
('Manga');


INSERT INTO categoria (nombre_categoria)VALUES
('Mochilas'),
('Agendas'),
('Cuadernos, libretas y recambios'),
('Papeleria de regalo'),
('Papel'),
('Alta escritura'),
('Creatividad'),
('Bella Artes'),
('Calculadoras y maquinas de oficina'),
('Archivo y clasificacion'),
('Estuches'),
('Escritura escolar');


INSERT INTO idioma (nombre_idioma) VALUES
('Español'),
('Inglés'),
('Francés'),
('Chino'),
('Italiano');


-- ========== 100 LIBROS ==========
INSERT INTO productos
(nombre_producto, descripcion, tipo_producto, precio, stock, estado_producto, fecha_alta, costo_real) VALUES
('Orgullo y prejuicio','Novela clásica que explora amor, prejuicios y tensiones sociales.','LIBRO',15.90,40,'DISPONIBLE','2024-03-01',10.50),
('Matar a un ruiseñor','Historia profunda sobre justicia, inocencia y desigualdad racial.','LIBRO',17.50,35,'AGOTADO','2024-03-02',12.00),
('1984','Distopía que retrata vigilancia extrema y pérdida de libertad.','LIBRO',16.90,50,'DISPONIBLE','2024-03-03',11.20),
('Rebelión en la granja','Sátira política que critica el abuso de poder y la manipulación.','LIBRO',14.90,45,'AGOTADO','2024-03-04',9.80),
('Crimen y castigo','Retrato psicológico sobre culpa, moralidad y redención.','LIBRO',18.90,30,'DISPONIBLE','2024-03-05',13.00),
('Los hermanos Karamázov','Novela filosófica sobre fe, duda y conflictos familiares.','LIBRO',22.50,25,'AGOTADO','2024-03-06',16.00),
('Guerra y paz','Épica histórica que combina guerra, amor y destino.','LIBRO',24.90,20,'DISPONIBLE','2024-03-07',18.00),
('Anna Karénina','Drama social que explora pasión, honor y tragedia.','LIBRO',19.90,40,'AGOTADO','2024-03-08',14.00),
('Madame Bovary','Retrato íntimo sobre deseos, frustración y búsqueda de libertad.','LIBRO',15.50,35,'DISPONIBLE','2024-03-09',10.00),
('El retrato de Dorian Gray','Historia sobre belleza, corrupción y consecuencias morales.','LIBRO',14.90,50,'AGOTADO','2024-03-10',9.50),
('Cien años de soledad','Saga familiar marcada por magia, memoria y destino.','LIBRO',21.90,45,'DISPONIBLE','2024-03-11',15.00),
('El amor en los tiempos del cólera','Relato sobre amor persistente y el paso del tiempo.','LIBRO',18.90,30,'AGOTADO','2024-03-12',12.50),
('La casa de los espíritus','Historia familiar llena de realismo mágico y emociones profundas.','LIBRO',17.90,40,'DISPONIBLE','2024-03-13',11.50),
('Rayuela','Novela experimental que invita a una lectura libre y fragmentada.','LIBRO',16.50,35,'AGOTADO','2024-03-14',10.50),
('Pedro Páramo','Relato breve que mezcla muerte, memoria y voces del pasado.','LIBRO',13.90,50,'DISPONIBLE','2024-03-15',8.50),
('Ficciones','Colección de relatos que exploran laberintos, símbolos y paradojas.','LIBRO',19.50,25,'AGOTADO','2024-03-16',14.00),
('La ciudad y los perros','Crítica social ambientada en un colegio militar opresivo.','LIBRO',17.90,30,'DISPONIBLE','2024-03-17',12.00),
('El túnel','Novela psicológica sobre obsesión, soledad y percepción distorsionada.','LIBRO',14.50,45,'AGOTADO','2024-03-18',9.50),
('Como agua para chocolate','Historia romántica donde emociones y cocina se entrelazan.','LIBRO',15.90,40,'DISPONIBLE','2024-03-19',10.50),
('Los detectives salvajes','Viaje literario que explora juventud, poesía y búsqueda personal.','LIBRO',22.90,20,'AGOTADO','2024-03-20',16.50),

('El Señor de los Anillos','Fantasía épica que narra una lucha entre luz y oscuridad.','LIBRO',34.90,25,'DISPONIBLE','2024-03-21',22.00),
('El Hobbit','Aventura fantástica que sigue el viaje inesperado de un hobbit.','LIBRO',18.50,40,'AGOTADO','2024-03-22',12.50),
('Harry Potter y la piedra filosofal','Historia juvenil sobre magia, amistad y descubrimiento personal.','LIBRO',19.90,60,'DISPONIBLE','2024-03-23',13.00),
('Harry Potter y la cámara secreta','Segunda entrega que profundiza en misterios y peligros en Hogwarts.','LIBRO',20.50,55,'AGOTADO','2024-03-24',14.00),
('Juego de tronos','Intriga política y fantasía en un mundo lleno de traiciones.','LIBRO',24.90,35,'DISPONIBLE','2024-03-25',18.00),
('Las crónicas de Narnia','Aventura fantástica que mezcla magia, criaturas míticas y valores humanos.','LIBRO',22.90,30,'AGOTADO','2024-03-26',16.00),
('La rueda del tiempo','Saga épica que explora destino, magia y ciclos eternos.','LIBRO',28.90,20,'DISPONIBLE','2024-03-27',19.50),
('El nombre del viento','Relato íntimo sobre un joven prodigio marcado por tragedia y talento.','LIBRO',21.90,45,'AGOTADO','2024-03-28',15.00),
('La historia interminable','Fantasía que une imaginación, aventura y crecimiento personal.','LIBRO',17.90,50,'DISPONIBLE','2024-03-29',11.50),
('American Gods','Fantasía contemporánea que mezcla mitología y crítica social.','LIBRO',19.90,35,'AGOTADO','2024-03-30',13.50),
('Dune','Épica espacial sobre poder, ecología y destino.','LIBRO',23.90,40,'DISPONIBLE','2024-03-31',17.00),
('Fahrenheit 451','Distopía que denuncia la censura y la pérdida del pensamiento crítico.','LIBRO',16.90,45,'AGOTADO','2024-04-01',11.00),
('Neuromante','Ciberpunk que explora tecnología, identidad y mundos virtuales.','LIBRO',18.50,30,'DISPONIBLE','2024-04-02',12.00),
('Fundación','Clásico de ciencia ficción sobre imperios, matemáticas y futuro.','LIBRO',17.90,35,'AGOTADO','2024-04-03',12.00),
('Yo, robot','Relatos que examinan ética, inteligencia artificial y humanidad.','LIBRO',15.90,50,'DISPONIBLE','2024-04-04',10.50),
('El fin de la infancia','Historia que reflexiona sobre evolución, esperanza y trascendencia.','LIBRO',19.50,25,'AGOTADO','2024-04-05',14.00),
('Hyperion','Novela coral que mezcla misterio, religión y ciencia ficción.','LIBRO',22.90,20,'DISPONIBLE','2024-04-06',16.50),
('El juego de Ender','Relato sobre estrategia, guerra y presión psicológica en la infancia.','LIBRO',16.90,45,'AGOTADO','2024-04-07',11.00),
('La mano izquierda de la oscuridad','Ciencia ficción que explora género, política y comunicación.','LIBRO',18.90,30,'DISPONIBLE','2024-04-08',12.50),
('Snow Crash','Ciberpunk frenético sobre tecnología, lenguaje y caos digital.','LIBRO',20.90,35,'AGOTADO','2024-04-09',14.50),

('El cuento de la criada','Distopía que reflexiona sobre control, identidad y libertad.','LIBRO',17.90,40,'DISPONIBLE','2024-04-10',12.00),
('El guardián entre el centeno','Historia sobre adolescencia, rebeldía y búsqueda personal.','LIBRO',14.50,35,'AGOTADO','2024-04-11',9.50),
('La ladrona de libros','Relato emotivo ambientado en la Segunda Guerra Mundial.','LIBRO',18.90,45,'DISPONIBLE','2024-04-12',13.00),
('El niño con el pijama de rayas','Historia conmovedora sobre inocencia en tiempos de guerra.','LIBRO',12.90,50,'AGOTADO','2024-04-13',8.00),
('Los juegos del hambre','Distopía juvenil sobre supervivencia y resistencia.','LIBRO',17.50,55,'DISPONIBLE','2024-04-14',12.00),
('En llamas','Segunda parte que intensifica la lucha y el conflicto social.','LIBRO',18.50,40,'AGOTADO','2024-04-15',13.00),
('Sinsajo','Conclusión de una saga marcada por revolución y sacrificio.','LIBRO',19.50,35,'DISPONIBLE','2024-04-16',14.00),
('Divergente','Historia juvenil sobre identidad, valentía y decisiones difíciles.','LIBRO',16.90,45,'AGOTADO','2024-04-17',11.00),
('Insurgente','Segunda parte que profundiza en conspiraciones y alianzas.','LIBRO',17.90,40,'DISPONIBLE','2024-04-18',12.00),
('Leal','Final de trilogía que explora verdad, sacrificio y libertad.','LIBRO',18.90,30,'AGOTADO','2024-04-19',13.00),
('El corredor del laberinto','Aventura distópica llena de misterio y supervivencia.','LIBRO',15.90,50,'DISPONIBLE','2024-04-20',10.50),
('Prueba de fuego','Segunda entrega con desafíos extremos y nuevas amenazas.','LIBRO',16.90,45,'AGOTADO','2024-04-21',11.50),
('La cura mortal','Cierre de saga que revela secretos y decisiones difíciles.','LIBRO',17.90,35,'DISPONIBLE','2024-04-22',12.50),
('It','Novela de terror que explora miedos profundos y amistad.','LIBRO',24.90,25,'AGOTADO','2024-04-23',18.00),
('El resplandor','Terror psicológico ambientado en un hotel aislado.','LIBRO',22.90,30,'DISPONIBLE','2024-04-24',16.00),
('Carrie','Historia sobre marginación, poder y venganza.','LIBRO',14.90,40,'AGOTADO','2024-04-25',9.50),
('Misery','Thriller psicológico sobre obsesión y cautiverio.','LIBRO',18.50,35,'DISPONIBLE','2024-04-26',13.00),
('Doctor Sueño','Secuela que mezcla trauma, redención y poderes psíquicos.','LIBRO',21.90,30,'AGOTADO','2024-04-27',15.00),
('El instituto','Suspenso juvenil con experimentos, poderes y conspiraciones.','LIBRO',23.50,25,'DISPONIBLE','2024-04-28',17.00),
('Cementerio de animales','Terror que reflexiona sobre duelo, límites y consecuencias.','LIBRO',19.90,40,'AGOTADO','2024-04-29',14.00),

('El alquimista','Fábula espiritual sobre destino, búsqueda y transformación personal.','LIBRO',16.90,45,'DISPONIBLE','2024-04-30',11.50),
('La sombra del viento','Misterio literario ambientado en la Barcelona de posguerra.','LIBRO',19.90,40,'AGOTADO','2024-05-01',14.00),
('El juego del ángel','Relato oscuro sobre obsesión, escritura y secretos.','LIBRO',18.90,35,'DISPONIBLE','2024-05-02',13.00),
('El prisionero del cielo','Historia que conecta pasado y presente con intriga y emoción.','LIBRO',17.90,50,'AGOTADO','2024-05-03',12.00),
('El laberinto de los espíritus','Cierre épico lleno de misterio, memoria y revelaciones.','LIBRO',22.90,30,'DISPONIBLE','2024-05-04',16.00),
('La sombra del viento (edición especial)','Versión ampliada con notas y contenido adicional.','LIBRO',24.90,25,'AGOTADO','2024-05-05',18.00),
('El código Da Vinci','Thriller que mezcla arte, religión y conspiraciones.','LIBRO',17.90,60,'DISPONIBLE','2024-05-06',12.50),
('Ángeles y demonios','Suspenso que enfrenta ciencia, fe y secretos ocultos.','LIBRO',18.90,55,'AGOTADO','2024-05-07',13.50),
('Inferno','Aventura que combina historia, símbolos y amenazas globales.','LIBRO',19.90,45,'DISPONIBLE','2024-05-08',14.00),
('El símbolo perdido','Misterio que explora sociedades secretas y conocimiento antiguo.','LIBRO',18.50,40,'AGOTADO','2024-05-09',13.00),
('La chica del tren','Thriller psicológico sobre memoria, sospechas y engaños.','LIBRO',16.90,50,'DISPONIBLE','2024-05-10',11.00),
('Perdida','Historia de misterio y manipulación en una relación turbulenta.','LIBRO',17.90,45,'AGOTADO','2024-05-11',12.50),
('La mujer en la ventana','Suspenso sobre paranoia, aislamiento y secretos ocultos.','LIBRO',15.90,40,'DISPONIBLE','2024-05-12',10.50),
('El silencio de los corderos','Thriller icónico sobre inteligencia, miedo y psicología criminal.','LIBRO',19.90,35,'AGOTADO','2024-05-13',14.00),
('Hannibal','Continuación intensa sobre obsesión, poder y oscuridad humana.','LIBRO',21.90,30,'DISPONIBLE','2024-05-14',15.50),
('El psicoanalista','Suspenso psicológico sobre amenazas, identidad y supervivencia.','LIBRO',18.90,50,'AGOTADO','2024-05-15',13.00),
('La paciente silenciosa','Thriller sobre trauma, silencio y revelaciones inesperadas.','LIBRO',17.90,45,'DISPONIBLE','2024-05-16',12.00),
('El hombre de tiza','Misterio que mezcla infancia, secretos y consecuencias del pasado.','LIBRO',16.50,40,'AGOTADO','2024-05-17',11.00),
('El cuarto mono','Investigación frenética contra un asesino meticuloso y cruel.','LIBRO',19.50,35,'DISPONIBLE','2024-05-18',14.00),
('La chica de nieve','Thriller ambientado en Nueva York sobre desapariciones y verdad.','LIBRO',18.90,50,'AGOTADO','2024-05-19',13.00),

('La chica del dragón tatuado','Thriller oscuro sobre secretos familiares, corrupción y venganza.','LIBRO',18.90,45,'DISPONIBLE','2024-05-20',13.00),
('La chica que soñaba con una cerilla y un bidón de gasolina','Segunda parte llena de tensión, investigación y revelaciones.','LIBRO',19.50,40,'AGOTADO','2024-05-21',14.00),
('La reina en el palacio de las corrientes de aire','Cierre intenso sobre justicia, conspiraciones y verdad.','LIBRO',20.90,35,'DISPONIBLE','2024-05-22',15.00),
('El nombre de la rosa','Misterio medieval que mezcla filosofía, religión y crimen.','LIBRO',17.90,50,'AGOTADO','2024-05-23',12.00),
('Baudolino','Aventura histórica llena de humor, fantasía y engaños.','LIBRO',18.90,40,'DISPONIBLE','2024-05-24',13.50),
('El péndulo de Foucault','Novela compleja sobre conspiraciones, símbolos y obsesión.','LIBRO',21.90,30,'AGOTADO','2024-05-25',16.00),
('El perfume','Historia inquietante sobre obsesión, aroma y poder.','LIBRO',16.90,45,'DISPONIBLE','2024-05-26',11.50),
('La elegancia del erizo','Relato sensible sobre filosofía, belleza y encuentros inesperados.','LIBRO',17.90,40,'AGOTADO','2024-05-27',12.00),
('Tokio Blues','Historia íntima sobre amor, pérdida y crecimiento personal.','LIBRO',18.50,35,'DISPONIBLE','2024-05-28',13.00),
('Kafka en la orilla','Novela surrealista que mezcla destino, sueños y simbolismo.','LIBRO',19.90,30,'AGOTADO','2024-05-29',14.00),
('1Q84 (Libro 1)','Relato paralelo lleno de misterio, amor y mundos alternos.','LIBRO',20.90,50,'DISPONIBLE','2024-05-30',15.50),
('1Q84 (Libro 2)','Segunda parte que profundiza en conexiones y enigmas.','LIBRO',21.50,45,'AGOTADO','2024-05-31',16.00),
('1Q84 (Libro 3)','Cierre emocional que une destinos y realidades.','LIBRO',22.90,40,'DISPONIBLE','2024-06-01',17.00),
('El viejo y el mar','Historia sobre lucha, dignidad y perseverancia.','LIBRO',14.90,60,'AGOTADO','2024-06-02',9.50),
('Por quién doblan las campanas','Relato bélico sobre amor, sacrificio y libertad.','LIBRO',18.90,50,'DISPONIBLE','2024-06-03',13.00),
('Fiesta','Novela sobre desorientación, excesos y búsqueda de sentido.','LIBRO',16.90,45,'AGOTADO','2024-06-04',11.00),
('Adiós a las armas','Historia intensa sobre guerra, amor y tragedia.','LIBRO',17.90,40,'DISPONIBLE','2024-06-05',12.50),
('El gran Gatsby','Retrato brillante sobre ambición, amor y decadencia.','LIBRO',15.90,55,'AGOTADO','2024-06-06',10.50),
('Matar a un hombre muerto','Thriller sobre secretos, culpa y decisiones irreversibles.','LIBRO',18.50,35,'DISPONIBLE','2024-06-07',13.00),
('La carretera','Relato postapocalíptico sobre supervivencia, amor y esperanza.','LIBRO',17.90,40,'AGOTADO','2024-06-08',12.00);


-- ========== 50 PAPELERÍA ==========
INSERT INTO productos (nombre_producto, descripcion, tipo_producto, precio, stock, estado_producto, fecha_alta, costo_real) VALUES
('Mochila escolar azul', 'Mochila resistente con múltiples compartimentos', 'PAPELERIA', 35.90, 50, 'DISPONIBLE', '2024-03-10', 25.00),
('Mochila deportiva Nike', 'Mochila deportiva de alta calidad', 'PAPELERIA', 45.00, 30, 'DISPONIBLE', '2024-03-11', 32.00),
('Mochila universitaria gris', 'Mochila con compartimento para portátil', 'PAPELERIA', 42.50, 40, 'DISPONIBLE', '2024-03-12', 30.00),
('Mochila infantil Spiderman', 'Mochila con diseño de superhéroe', 'PAPELERIA', 28.90, 35, 'DISPONIBLE', '2024-03-13', 20.00),

('Agenda ejecutiva 2025', 'Agenda día por página de cuero', 'PAPELERIA', 18.90, 60, 'DISPONIBLE', '2024-03-14', 13.50),
('Agenda escolar 2025', 'Agenda semanal para estudiantes', 'PAPELERIA', 12.50, 80, 'AGOTADO', '2024-03-15', 9.00),
('Agenda minimalista 2025', 'Agenda con diseño simple y elegante', 'PAPELERIA', 15.90, 55, 'DISPONIBLE', '2024-03-16', 11.00),
('Planificador mensual 2025', 'Planificador con vista mensual', 'PAPELERIA', 14.50, 45, 'DISPONIBLE', '2024-03-17', 10.00),

('Cuaderno A4 cuadriculado', 'Cuaderno 100 hojas de calidad', 'PAPELERIA', 3.50, 150, 'AGOTADO', '2024-03-18', 2.50),
('Cuaderno A5 rayado', 'Cuaderno tamaño medio 80 hojas', 'PAPELERIA', 2.80, 200, 'DISPONIBLE', '2024-03-19', 2.00),
('Libreta espiral A4', 'Libreta con espiral metálico', 'PAPELERIA', 4.50, 120, 'DISPONIBLE', '2024-03-20', 3.20),
('Bloc notas adhesivas', 'Pack de 5 blocs de colores', 'PAPELERIA', 5.90, 100, 'DISPONIBLE', '2024-03-21', 4.00),
('Recambio hojas A4', 'Paquete 500 hojas cuadriculadas', 'PAPELERIA', 6.50, 80, 'DISPONIBLE', '2024-03-22', 4.50),
('Cuaderno Moleskine', 'Cuaderno de lujo tapa dura', 'PAPELERIA', 18.90, 40, 'AGOTADO', '2024-03-23', 13.50),

('Tarjetas de felicitación', 'Pack 10 tarjetas con sobres', 'PAPELERIA', 8.90, 70, 'DISPONIBLE', '2024-03-24', 6.00),
('Papel de regalo navideño', 'Rollo 5 metros diseños variados', 'PAPELERIA', 4.50, 90, 'DISPONIBLE', '2024-03-25', 3.00),
('Sobres de colores', 'Pack 25 sobres tamaño carta', 'PAPELERIA', 3.90, 85, 'DISPONIBLE', '2024-03-26', 2.50),
('Etiquetas adhesivas', 'Pack 100 etiquetas decorativas', 'PAPELERIA', 5.50, 65, 'DISPONIBLE', '2024-03-27', 3.80),

('Papel A4 80g', 'Resma 500 hojas blancas', 'PAPELERIA', 7.50, 200, 'DISPONIBLE', '2024-03-28', 5.20),
('Papel fotográfico', 'Pack 20 hojas glossy A4', 'PAPELERIA', 12.90, 45, 'DISPONIBLE', '2024-03-29', 9.00),
('Papel kraft', 'Rollo 10 metros marrón', 'PAPELERIA', 6.90, 55, 'DISPONIBLE', '2024-03-30', 4.80),
('Cartulinas colores', 'Pack 50 cartulinas A4', 'PAPELERIA', 8.90, 60, 'DISPONIBLE', '2024-03-31', 6.20),

('Pluma estilográfica Parker', 'Pluma de lujo con estuche', 'PAPELERIA', 45.00, 25, 'AGOTADO', '2024-04-01', 32.00),
('Bolígrafo Montblanc', 'Bolígrafo de alta gama', 'PAPELERIA', 380.00, 10, 'AGOTADO', '2024-04-02', 270.00),
('Set de plumas caligrafía', 'Kit completo de caligrafía', 'PAPELERIA', 28.50, 30, 'DISPONIBLE', '2024-04-03', 20.00),
('Portaminas profesional', 'Portaminas metálico 0.5mm', 'PAPELERIA', 15.90, 40, 'DISPONIBLE', '2024-04-04', 11.00),

('Set acuarelas profesional', 'Caja 24 colores acuarela', 'PAPELERIA', 32.90, 35, 'AGOTADO', '2024-04-05', 23.00),
('Lápices de colores Faber-Castell', 'Caja 48 lápices profesionales', 'PAPELERIA', 28.50, 40, 'DISPONIBLE', '2024-04-06', 20.00),
('Set rotuladores Copic', 'Set 12 rotuladores para manga', 'PAPELERIA', 55.00, 20, 'AGOTADO', '2024-04-07', 39.00),
('Sketchbook A4', 'Cuaderno dibujo 100 hojas', 'PAPELERIA', 14.90, 45, 'DISPONIBLE', '2024-04-08', 10.50),
('Témperas escolares', 'Set 12 botes de colores', 'PAPELERIA', 9.90, 60, 'DISPONIBLE', '2024-04-09', 7.00),
('Kit manualidades infantil', 'Set completo de materiales creativos', 'PAPELERIA', 18.90, 50, 'DISPONIBLE', '2024-04-10', 13.50),

('Óleo profesional', 'Set 12 tubos colores básicos', 'PAPELERIA', 42.00, 25, 'AGOTADO', '2024-04-11', 30.00),
('Pinceles artísticos', 'Set 10 pinceles variados', 'PAPELERIA', 24.50, 35, 'DISPONIBLE', '2024-04-12', 17.50),
('Lienzo preparado 50x60', 'Lienzo sobre bastidor', 'PAPELERIA', 16.90, 30, 'DISPONIBLE', '2024-04-13', 12.00),
('Caballete de madera', 'Caballete plegable profesional', 'PAPELERIA', 68.00, 15, 'AGOTADO', '2024-04-14', 48.00),

('Calculadora científica Casio', 'Calculadora con funciones avanzadas', 'PAPELERIA', 28.90, 50, 'DISPONIBLE', '2024-04-15', 20.50),
('Calculadora básica', 'Calculadora de escritorio 12 dígitos', 'PAPELERIA', 12.50, 70, 'DISPONIBLE', '2024-04-16', 8.80),
('Destructora de papel', 'Destructora con corte en tiras', 'PAPELERIA', 85.00, 20, 'AGOTADO', '2024-04-17', 60.00),
('Plastificadora A4', 'Máquina plastificar documentos', 'PAPELERIA', 45.00, 18, 'DISPONIBLE', '2024-04-18', 32.00),

('Archivador palanca A4', 'Archivador lomo 75mm', 'PAPELERIA', 4.50, 150, 'DISPONIBLE', '2024-04-19', 3.20),
('Carpeta anillas', 'Carpeta 4 anillas tamaño A4', 'PAPELERIA', 3.90, 120, 'DISPONIBLE', '2024-04-20', 2.70),
('Separadores índice', 'Juego 12 separadores de colores', 'PAPELERIA', 2.90, 100, 'DISPONIBLE', '2024-04-21', 2.00),
('Cajas archivo', 'Pack 10 cajas cartón A4', 'PAPELERIA', 15.90, 60, 'DISPONIBLE', '2024-04-22', 11.00),
('Fundas portadocumentos', 'Pack 100 fundas transparentes', 'PAPELERIA', 8.50, 80, 'DISPONIBLE', '2024-04-23', 6.00),

('Estuche triple', 'Estuche 3 compartimentos', 'PAPELERIA', 12.90, 65, 'DISPONIBLE', '2024-04-24', 9.00),
('Estuche cilíndrico', 'Estuche redondo con cremallera', 'PAPELERIA', 8.90, 85, 'DISPONIBLE', '2024-04-25', 6.20),
('Portatodo enrollable', 'Estuche enrollable para lápices', 'PAPELERIA', 14.50, 45, 'DISPONIBLE', '2024-04-26', 10.00),

('Bolígrafos BIC azul', 'Pack 10 bolígrafos', 'PAPELERIA', 3.50, 200, 'DISPONIBLE', '2024-04-27', 2.50),
('Lápices HB', 'Pack 12 lápices grafito', 'PAPELERIA', 4.90, 150, 'DISPONIBLE', '2024-04-28', 3.40);



-- ========== DATOS DE LIBROS ==========
INSERT INTO libros
(id_producto, ISBN, editorial, fecha_publicacion, autor, numero_paginas, id_genero, id_idioma, resumen) VALUES
(1,'9780000000011','Planeta','2001-05-12','Jane Austen',432,1,1,
'Una historia que examina con delicadeza las tensiones sociales y emocionales de una época marcada por las apariencias y los prejuicios. A través de diálogos brillantes y personajes inolvidables, la novela revela cómo el orgullo y 
la primera impresión pueden distorsionar la verdad, mientras el amor y la madurez ofrecen una segunda oportunidad para comprender al otro. Con una mirada irónica y profundamente humana, la autora retrata las expectativas sociales, 
los conflictos familiares y la búsqueda de la felicidad en un mundo donde cada gesto tiene un significado oculto. La obra combina romance, crítica social y humor inteligente para mostrar que, incluso en los entornos más rígidos, 
el corazón encuentra su propio camino.'),
(2,'9780000000012','Alfaguara','1998-03-22','Harper Lee',384,2,2,
'Un relato que combina inocencia y crudeza para mostrar cómo la justicia puede verse distorsionada por el miedo y la desigualdad. Narrada desde la mirada de una niña que intenta comprender el mundo adulto, la historia expone el 
racismo, la compasión y la valentía moral en un pueblo donde la verdad lucha por abrirse paso. A medida que la protagonista observa los conflictos de su comunidad, descubre que la bondad puede surgir en los lugares más inesperados 
y que la empatía es una fuerza capaz de desafiar los prejuicios más arraigados. La novela es un retrato conmovedor de la pérdida de la inocencia y del poder transformador de la integridad.'),
(3,'9780000000013','Salamandra','2005-11-10','George Orwell',328,3,3,
'Una visión inquietante de un futuro donde la libertad se diluye bajo un sistema que controla cada pensamiento y cada gesto. La novela retrata un régimen que manipula la información, reescribe la historia y vigila cada aspecto de 
la vida, mostrando cómo el miedo y la propaganda pueden moldear la realidad hasta borrar la identidad individual. A través de su protagonista, atrapado entre la obediencia y el deseo de rebelarse, la obra explora la fragilidad de 
la verdad y la resistencia del espíritu humano. Es una advertencia poderosa sobre los peligros del totalitarismo y la importancia de preservar la libertad de pensamiento.'),
(4,'9780000000014','Anagrama','1999-07-18','George Orwell',144,4,4,
'Una fábula que revela cómo el poder puede corromper incluso las causas más nobles cuando la ambición supera a la ética. A través de animales que buscan construir una sociedad justa, la historia muestra cómo los ideales pueden ser 
manipulados y transformados en herramientas de opresión cuando unos pocos se apropian del liderazgo. La narración, tan sencilla como profunda, expone la fragilidad de los sistemas políticos y la facilidad con la que la esperanza 
puede convertirse en tiranía. Es una reflexión mordaz sobre la naturaleza del poder y la traición de los principios revolucionarios.'),
(5,'9780000000015','Minotauro','2003-02-14','Fiódor Dostoyevski',672,5,5,
'Un viaje profundo a la mente humana donde la culpa, el miedo y la moralidad se enfrentan en un conflicto devastador. La novela explora las consecuencias psicológicas de un crimen, revelando cómo la conciencia, la redención y el 
sufrimiento se entrelazan en la búsqueda desesperada de sentido y perdón. A través de personajes atormentados y situaciones límite, la obra examina la lucha interna entre el bien y el mal, así como la posibilidad de encontrar luz 
incluso en los rincones más oscuros del alma. Es un retrato magistral de la complejidad humana y de la necesidad de redención.'),
(6,'9780000000016','Penguin Random House','2007-09-03','Fiódor Dostoyevski',824,6,1,
'Una obra monumental que explora la fe, la duda y los lazos familiares en un mundo lleno de contradicciones. A través de personajes complejos y debates filosóficos intensos, la historia profundiza en la naturaleza del bien y del 
mal, mostrando cómo cada individuo lucha con sus propias sombras internas. La trama, marcada por conflictos morales y pasiones desbordadas, invita a reflexionar sobre la responsabilidad, la libertad y el destino. Es una de las 
obras más profundas de la literatura universal, capaz de cuestionar las certezas más arraigadas.'),
(7,'9780000000017','Debolsillo','2010-04-27','León Tolstói',1225,7,2,
'Una epopeya que entrelaza destinos personales con los grandes acontecimientos históricos que transforman naciones enteras. La novela combina batallas, intrigas políticas y dramas íntimos para mostrar cómo el amor, el honor y la 
ambición se ven afectados por el paso implacable de la historia. A través de un amplio elenco de personajes, la obra retrata la fragilidad humana frente al caos de la guerra y la búsqueda de sentido en tiempos de incertidumbre. 
Es un retrato monumental de la vida, la muerte y la fuerza del espíritu humano.'),
(8,'9780000000018','Plaza & Janés','2004-08-19','León Tolstói',864,8,3,
'Una historia intensa donde la pasión y las normas sociales chocan, revelando las consecuencias de seguir los dictados del corazón. La protagonista lucha entre el deseo y el deber, enfrentándose a una sociedad que castiga 
cualquier desviación de sus estrictas expectativas. La novela explora la complejidad del amor, la maternidad, la infidelidad y la identidad personal, mostrando cómo las decisiones íntimas pueden convertirse en tormentas públicas. 
Es un retrato profundo de la condición humana y de la búsqueda de autenticidad en un mundo lleno de juicios.'),
(9,'9780000000019','Lumen','1997-12-05','Gustave Flaubert',392,9,4,
'Un retrato íntimo de una mujer atrapada entre sus deseos y las limitaciones de una sociedad que no le permite soñar. La novela muestra cómo la búsqueda de emociones intensas puede llevar a decisiones que transforman la vida, 
mientras la realidad se impone con una fuerza implacable. A través de una prosa elegante y minuciosa, la historia revela la tensión entre la fantasía y la rutina, y cómo la insatisfacción puede convertirse en una prisión 
emocional. Es una obra que cuestiona las expectativas sociales y la fragilidad de los anhelos humanos.'),
(10,'9780000000020','RBA','2002-06-30','Oscar Wilde',256,10,5,
'Una reflexión sobre la belleza, la corrupción y el precio que se paga por ignorar las consecuencias de los propios actos. A través de un pacto simbólico, la historia muestra cómo la obsesión por la juventud eterna puede destruir 
el alma mientras el exterior permanece intacto. La novela explora la dualidad entre apariencia y realidad, así como la influencia del hedonismo y la manipulación moral. Es una obra provocadora que invita a cuestionar la 
superficialidad y la decadencia de una sociedad obsesionada con la imagen.'),
(11,'9780000000021','Planeta','2008-03-11','Gabriel García Márquez',496,11,1,
'Una saga familiar donde lo mágico y lo cotidiano se entrelazan para mostrar la fragilidad del tiempo y la memoria. Con un estilo poético y envolvente, la novela recorre generaciones marcadas por el amor, la soledad y los ciclos 
inevitables del destino. A través de un universo lleno de símbolos y acontecimientos extraordinarios, la historia revela cómo los errores y las pasiones se repiten una y otra vez. Es una obra que captura la esencia de la vida 
latinoamericana y la fuerza de la imaginación.'),
(12,'9780000000022','Alfaguara','2006-10-09','Gabriel García Márquez',368,12,2,
'Un relato que celebra la persistencia del amor incluso cuando los años transforman cuerpos, vidas y esperanzas. La historia sigue a dos amantes que, tras décadas de separación, descubren que los sentimientos pueden sobrevivir 
al paso del tiempo y renacer con una fuerza inesperada. La novela explora la paciencia, la obsesión y la ternura, mostrando cómo el amor adopta formas distintas a lo largo de la vida. Es una oda a la esperanza y a la capacidad 
humana de reinventarse.'),
(13,'9780000000023','Salamandra','2012-01-17','Isabel Allende',448,13,3,
'Una historia que mezcla política, emociones y espiritualidad para retratar generaciones marcadas por la fuerza del destino. La novela combina realismo mágico y drama familiar para mostrar cómo los secretos, las pérdidas y las 
pasiones moldean la vida de quienes buscan su lugar en el mundo. A través de personajes intensos y atmósferas vibrantes, la obra revela la importancia de la memoria y la resiliencia. Es un viaje emocional que conecta lo íntimo 
con lo histórico.'),
(14,'9780000000024','Anagrama','2000-09-25','Julio Cortázar',600,14,4,
'Una novela que rompe las reglas tradicionales y convierte la lectura en un juego lleno de caminos posibles. Con una estructura innovadora, invita al lector a explorar múltiples interpretaciones mientras los personajes se mueven 
entre lo real y lo imaginario. La obra desafía la lógica narrativa y propone una experiencia literaria única, donde cada elección abre nuevas perspectivas. Es un homenaje a la libertad creativa y a la experimentación literaria.'),
(15,'9780000000025','Minotauro','1995-04-03','Juan Rulfo',124,15,5,
'Un relato breve y poderoso donde las voces del pasado resuenan en un pueblo marcado por la ausencia y el misterio. La obra captura la esencia de la soledad y la desolación, mostrando cómo los recuerdos pueden convertirse en 
fantasmas que nunca abandonan a quienes los escuchan. Con un estilo poético y evocador, la historia revela la profundidad emocional de un mundo suspendido entre la vida y la muerte. Es una obra que deja una huella imborrable.'),
(16,'9780000000026','Penguin Random House','2011-07-14','Jorge Luis Borges',224,16,1,
'Una colección de relatos que desafían la lógica y exploran mundos donde el tiempo, el lenguaje y la realidad se entrelazan. Cada historia invita a reflexionar sobre los laberintos de la mente humana y las infinitas posibilidades 
del pensamiento. Con su estilo preciso y filosófico, el autor construye universos que cuestionan la percepción y la identidad. Es una obra que celebra la imaginación y el poder del intelecto.'),
(17,'9780000000027','Debolsillo','2009-02-28','Mario Vargas Llosa',480,17,2,
'Una crítica social que revela la dureza de un entorno militar y la complejidad de las relaciones humanas. La novela muestra cómo la disciplina extrema, la violencia y la búsqueda de identidad pueden moldear a quienes crecen 
bajo estructuras rígidas. A través de conflictos internos y tensiones colectivas, la obra explora la fragilidad emocional y la necesidad de pertenencia. Es un retrato contundente de la adolescencia y del impacto de la autoridad.'),
(18,'9780000000028','Plaza & Janés','1996-11-08','Ernesto Sabato',160,18,3,
'Una mirada profunda a la mente de un hombre consumido por la obsesión y la incapacidad de conectar con el mundo. La historia explora la fragilidad emocional y la oscuridad interior que pueden surgir cuando la realidad se vuelve 
insoportable. Con una narrativa intensa y psicológica, la obra revela los abismos de la conciencia humana y la lucha por encontrar sentido en medio del caos. Es un viaje perturbador hacia los límites de la percepción.'),
(19,'9780000000029','Lumen','2013-05-21','Laura Esquivel',256,19,4,
'Una historia donde los sentimientos se expresan a través de sabores, gestos y tradiciones que marcan cada capítulo. La novela combina magia, pasión y costumbres familiares para mostrar cómo el amor puede manifestarse en los 
detalles más cotidianos. A través de una protagonista que vive entre el deber y el deseo, la obra revela la fuerza de las emociones reprimidas y la importancia de la libertad personal. Es un relato lleno de sensibilidad y 
simbolismo.'),
(20,'9780000000030','RBA','2001-01-29','Roberto Bolaño',672,20,5,
'Un viaje literario que sigue a jóvenes poetas en su búsqueda de identidad, libertad y un lugar en el mundo. A través de encuentros, pérdidas y descubrimientos, la novela retrata la intensidad de una generación que vive entre la 
incertidumbre y el deseo de trascender. Con un estilo fragmentado y vibrante, la obra captura la energía de la juventud y la necesidad de encontrar una voz propia. Es una exploración apasionada de la creación artística y del 
sentido de pertenencia.'),

(21,'9780000000031','Planeta','2002-05-12','J.R.R. Tolkien',1216,21,1,
'Una epopeya que sigue la lucha entre fuerzas antiguas mientras un grupo diverso emprende un viaje que definirá el destino de su mundo. A través de paisajes míticos, alianzas improbables y amenazas que resurgen desde las sombras, la historia explora el valor, la amistad y el sacrificio que exige enfrentarse al mal en su forma más pura.'),
(22,'9780000000032','Alfaguara','1999-03-22','J.R.R. Tolkien',310,22,2,
'Una aventura que comienza en la tranquilidad de un hogar y se transforma en un viaje lleno de peligros, magia y descubrimientos. El protagonista, arrancado de su rutina, se ve obligado a confrontar criaturas desconocidas y desafíos que pondrán a prueba su ingenio, su coraje y su capacidad para aceptar un destino que nunca imaginó.'),
(23,'9780000000033','Salamandra','2001-11-10','J.K. Rowling',320,23,3,
'La historia de un niño que descubre un mundo oculto donde la magia convive con desafíos que pondrán a prueba su valentía. Entre amistades nuevas, misterios que se esconden en cada pasillo y secretos que rodean su propio origen, el protagonista aprende que el valor no consiste en no tener miedo, sino en enfrentarlo.'),
(24,'9780000000034','Anagrama','2003-07-18','J.K. Rowling',352,1,4,
'Una nueva amenaza surge en Hogwarts, revelando secretos que conectan el pasado con los peligros del presente. Mientras el protagonista intenta comprender su papel en un conflicto que crece en las sombras, la historia profundiza en la lealtad, la identidad y el peso de las decisiones que pueden cambiar el rumbo del mundo mágico.'),
(25,'9780000000035','Minotauro','2005-02-14','George R.R. Martin',694,2,5,
'Un relato donde la ambición y la traición moldean un mundo en el que cada decisión puede significar vida o muerte. Entre intrigas políticas, alianzas frágiles y personajes que luchan por sobrevivir en un entorno despiadado, la historia muestra cómo el poder puede convertirse en una carga tan peligrosa como irresistible.'),
(26,'9780000000036','Penguin Random House','1998-09-03','C.S. Lewis',768,3,1,
'Una saga que combina fantasía, valores humanos y criaturas míticas para narrar un viaje lleno de significado. A través de reinos encantados, batallas simbólicas y encuentros con seres extraordinarios, la obra invita a reflexionar sobre la fe, la valentía y la importancia de creer en aquello que no siempre se puede ver.'),
(27,'9780000000037','Debolsillo','2007-04-27','Robert Jordan',832,4,2,
'Una historia que entrelaza destinos y profecías en un universo donde el tiempo fluye en ciclos eternos. Con un elenco amplio y complejo, la novela explora la lucha entre la luz y la sombra, mostrando cómo incluso los actos más pequeños pueden alterar el curso de un mundo que se enfrenta a su propia renovación.'),
(28,'9780000000038','Plaza & Janés','2010-08-19','Patrick Rothfuss',662,5,3,
'Un relato íntimo donde un joven prodigio narra su vida marcada por tragedias, aprendizajes y un talento excepcional. A través de recuerdos que mezclan dolor, descubrimiento y una búsqueda incansable de conocimiento, la historia revela cómo se forja una leyenda en un mundo donde la música, la magia y la palabra tienen un poder inmenso.'),
(29,'9780000000039','Lumen','1996-12-05','Michael Ende',448,6,4,
'Una aventura que invita a reflexionar sobre imaginación, identidad y el poder de las historias. En un mundo donde la fantasía y la realidad se entrelazan, el protagonista descubre que los relatos pueden transformar no solo el destino de los personajes, sino también el de quienes se atreven a creer en ellos.'),
(30,'9780000000040','RBA','2004-06-30','Neil Gaiman',624,7,5,
'Una mezcla de mitología y modernidad que cuestiona la fe, la identidad y el papel de los dioses en un mundo cambiante. La novela explora cómo las creencias evolucionan con el tiempo y cómo las figuras divinas deben adaptarse a una sociedad que ya no las recuerda, mientras fuerzas antiguas y nuevas compiten por sobrevivir.'),
(31,'9780000000041','Planeta','2008-03-11','Frank Herbert',688,8,1,
'Una epopeya que combina política, ecología y espiritualidad en un planeta donde cada recurso es motivo de conflicto. La historia profundiza en la lucha por el poder, la supervivencia y el control del entorno, mostrando cómo la ambición humana puede alterar el equilibrio de un mundo tan hermoso como peligroso.'),
(32,'9780000000042','Alfaguara','2006-10-09','Ray Bradbury',256,9,2,
'Una advertencia sobre los peligros de la censura y la pérdida del pensamiento crítico en una sociedad controlada. La novela retrata un futuro donde los libros son perseguidos y el conocimiento se convierte en una amenaza, invitando a reflexionar sobre la libertad intelectual y el valor de preservar la memoria colectiva.'),
(33,'9780000000043','Salamandra','2012-01-17','William Gibson',336,10,3,
'Una visión futurista donde tecnología, identidad y poder se entrelazan en un mundo dominado por el ciberespacio. La historia explora los límites entre lo humano y lo digital, mostrando cómo la información puede convertirse en la moneda más valiosa y peligrosa de todas.'),
(34,'9780000000044','Anagrama','2000-09-25','Isaac Asimov',255,11,4,
'Una obra que explora el ascenso y caída de imperios mediante la ciencia, la predicción y la razón. A través de un análisis profundo del comportamiento humano y las fuerzas que moldean la historia, la novela plantea cómo el conocimiento puede ser tanto una herramienta de salvación como un arma de destrucción.'),
(35,'9780000000045','Minotauro','1995-04-03','Isaac Asimov',320,12,5,
'Una colección de relatos que examinan la relación entre humanos y máquinas, cuestionando la ética, la lógica y los límites de la inteligencia artificial. Cada historia plantea dilemas morales que invitan a reflexionar sobre el futuro de la tecnología y su impacto en la sociedad.'),
(36,'9780000000046','Penguin Random House','2011-07-14','Arthur C. Clarke',240,13,1,
'Una historia que reflexiona sobre el futuro de la humanidad y los límites de la evolución. A través de encuentros con inteligencias superiores y descubrimientos que desafían la comprensión humana, la novela plantea preguntas sobre nuestro lugar en el universo y el destino de la especie.'),
(37,'9780000000047','Debolsillo','2009-02-28','Dan Simmons',482,14,2,
'Una novela coral que mezcla religión, misterio y ciencia ficción en un viaje hacia lo desconocido. Cada personaje aporta una perspectiva única sobre la fe, el miedo y la esperanza, mientras la trama avanza hacia un destino tan inquietante como fascinante.'),
(38,'9780000000048','Plaza & Janés','1996-11-08','Orson Scott Card',352,15,3,
'Un relato sobre estrategia, presión y crecimiento personal en un entorno donde el juego y la guerra se confunden. El protagonista, sometido a pruebas extremas, descubre que la inteligencia y la empatía pueden ser armas tan poderosas como la fuerza bruta.'),
(39,'9780000000049','Lumen','2013-05-21','Ursula K. Le Guin',304,16,4,
'Una historia que explora identidad, género y política en un mundo donde las diferencias son esenciales para comprenderse. La novela invita a cuestionar las estructuras sociales y a reflexionar sobre la empatía como puente entre culturas aparentemente opuestas.'),
(40,'9780000000050','RBA','2001-01-29','Neal Stephenson',480,17,5,
'Una aventura ciberpunk que combina lenguaje, tecnología y caos en un mundo hiperconectado. La trama se adentra en conspiraciones digitales, códigos antiguos y sociedades secretas, mostrando cómo la información puede moldear la realidad y alterar el destino de quienes la controlan.'),

(41,'9780000000051','Planeta','2010-04-30','Margaret Atwood',328,18,1,
'Una distopía que examina el control social y la pérdida de identidad en un régimen opresivo. A través de una narración inquietante y profundamente humana, la historia muestra cómo el poder puede moldear cuerpos, pensamientos y destinos, mientras la protagonista lucha por conservar su voz en un mundo que intenta silenciarla.'),
(42,'9780000000052','Alfaguara','1995-07-11','J.D. Salinger',277,19,2,
'Un relato íntimo sobre la confusión adolescente y la búsqueda de autenticidad en un mundo que parece falso. Con una voz narrativa única, la novela captura la vulnerabilidad, la rebeldía y la necesidad de encontrar un lugar propio cuando todo alrededor parece superficial o incomprensible.'),
(43,'9780000000053','Salamandra','2008-02-14','Markus Zusak',576,20,3,
'Una historia conmovedora narrada desde una perspectiva inesperada que revela la fuerza de las palabras en tiempos oscuros. En medio de la guerra, la literatura se convierte en refugio, resistencia y consuelo, mientras una niña descubre que incluso en la tragedia puede florecer la esperanza.'),
(44,'9780000000054','Anagrama','2006-09-22','John Boyne',224,21,4,
'Una mirada inocente y devastadora a los horrores de la guerra a través de los ojos de un niño. La historia, sencilla en apariencia pero profunda en su impacto, muestra cómo la ignorancia infantil puede chocar con la brutalidad del mundo adulto, revelando verdades que desgarran.'),
(45,'9780000000055','Minotauro','2012-11-03','Suzanne Collins',384,22,5,
'Una distopía donde la supervivencia se convierte en espectáculo y la resistencia en esperanza. La protagonista, obligada a luchar en un juego mortal, descubre que la valentía puede desafiar sistemas enteros y que incluso un gesto pequeño puede encender una revolución.'),
(46,'9780000000056','Penguin Random House','2013-05-19','Suzanne Collins',416,23,1,
'Una continuación que intensifica la lucha interna y externa de sus protagonistas en un mundo dividido. Entre alianzas frágiles, amenazas crecientes y decisiones imposibles, la historia profundiza en el costo emocional de convertirse en símbolo de una rebelión que no deja espacio para la inocencia.'),
(47,'9780000000057','Debolsillo','2014-03-08','Suzanne Collins',432,1,2,
'Un cierre marcado por decisiones difíciles, sacrificios y la búsqueda de libertad. La protagonista debe enfrentarse a verdades dolorosas y asumir el peso de un conflicto que ha transformado su vida, mientras intenta reconstruirse en medio de las ruinas de la guerra.'),
(48,'9780000000058','Plaza & Janés','2011-10-17','Veronica Roth',480,2,3,
'Una historia sobre valentía, identidad y la presión de elegir un camino propio. En un mundo dividido por facciones, la protagonista descubre que su lugar no está definido por las expectativas ajenas, sino por la fuerza de sus decisiones y la complejidad de su carácter.'),
(49,'9780000000059','Lumen','2012-04-29','Veronica Roth',464,3,4,
'Una segunda parte que revela conspiraciones y pone a prueba la confianza entre aliados. Mientras el mundo que conocía se desmorona, la protagonista debe enfrentarse a traiciones, secretos y dilemas que desafían su visión de la justicia y el sacrificio.'),
(50,'9780000000060','RBA','2013-01-12','Veronica Roth',526,4,5,
'Un final que enfrenta a los personajes con verdades dolorosas y decisiones irreversibles. La historia explora el perdón, la identidad y el precio de la libertad, mostrando cómo la verdad puede ser tan liberadora como devastadora.'),
(51,'9780000000061','Planeta','2010-09-03','James Dashner',368,5,1,
'Una aventura distópica llena de misterio donde la memoria perdida es la clave para sobrevivir. En un entorno hostil y cambiante, los protagonistas deben descifrar pistas, enfrentar criaturas mortales y descubrir quiénes eran antes de que su pasado fuera borrado.'),
(52,'9780000000062','Alfaguara','2011-06-21','James Dashner',384,6,2,
'Una carrera contrarreloj en un mundo hostil donde cada paso puede ser el último. La historia intensifica el peligro y la incertidumbre, revelando nuevas amenazas y secretos que obligan a los protagonistas a cuestionar todo lo que creían saber.'),
(53,'9780000000063','Salamandra','2012-08-14','James Dashner',400,7,3,
'Un cierre que revela secretos ocultos y obliga a enfrentar la verdad detrás del experimento. La novela explora la manipulación, la identidad y el sacrificio, mostrando cómo la búsqueda de respuestas puede tener un costo emocional devastador.'),
(54,'9780000000064','Anagrama','1986-01-28','Stephen King',1138,8,4,
'Una historia de terror que explora los miedos más profundos y la fuerza de la amistad. En un pueblo marcado por una presencia maligna, un grupo de jóvenes descubre que la unión y el coraje pueden desafiar incluso a las sombras más antiguas y aterradoras.'),
(55,'9780000000065','Minotauro','1977-05-23','Stephen King',512,9,5,
'Un thriller psicológico ambientado en un hotel aislado donde la locura acecha en cada rincón. La novela profundiza en la fragilidad mental, los secretos familiares y la influencia de fuerzas oscuras que se alimentan del miedo y la desesperación.'),
(56,'9780000000066','Penguin Random House','1974-10-01','Stephen King',199,10,1,
'Una historia sobre marginación, poder y las consecuencias devastadoras del abuso. La protagonista, víctima de burlas y humillaciones, descubre un poder latente que se desata con consecuencias irreversibles cuando la crueldad supera todos los límites.'),
(57,'9780000000067','Debolsillo','1987-06-09','Stephen King',368,11,2,
'Un relato inquietante sobre obsesión, cautiverio y la delgada línea entre admiración y locura. La novela muestra cómo la devoción puede transformarse en una amenaza cuando la realidad se distorsiona y el control se convierte en una forma de violencia.'),
(58,'9780000000068','Plaza & Janés','2013-09-24','Stephen King',544,12,3,
'Una secuela que mezcla trauma, redención y poderes psíquicos en un viaje emocional. El protagonista, marcado por su pasado, debe enfrentarse a nuevas amenazas mientras intenta reconstruir su vida y comprender el alcance de sus habilidades.'),
(59,'9780000000069','Lumen','2019-05-28','Stephen King',576,13,4,
'Una historia de suspenso juvenil donde nada es lo que parece y el peligro es constante. Entre desapariciones, secretos y fuerzas inexplicables, los protagonistas deben confiar en su intuición para sobrevivir a un misterio que crece con cada página.'),
(60,'9780000000070','RBA','1983-11-14','Stephen King',424,14,5,
'Un relato que reflexiona sobre el duelo, los límites humanos y las consecuencias de desafiar la naturaleza. La historia muestra cómo el dolor puede llevar a decisiones desesperadas y cómo el intento de revertir la pérdida puede abrir puertas que nunca debieron cruzarse.'),

(61,'9780000000071','Planeta','2010-04-30','Paulo Coelho',208,15,1,
'Una fábula espiritual que invita a seguir los sueños y a descubrir el propio camino. A través de encuentros simbólicos y reflexiones íntimas, la historia recuerda que cada persona guarda un destino único y que la verdadera sabiduría surge cuando se escucha la voz interior que guía hacia lo esencial.'),
(62,'9780000000072','Alfaguara','2001-05-01','Carlos Ruiz Zafón',576,16,2,
'Un misterio literario que entrelaza memoria, amor y secretos en la Barcelona de posguerra. Entre sombras, libros olvidados y pasiones prohibidas, la novela revela cómo las historias pueden marcar vidas enteras y cómo el pasado nunca desaparece del todo, sino que espera ser descubierto.'),
(63,'9780000000073','Salamandra','2008-05-02','Carlos Ruiz Zafón',480,17,3,
'Una historia oscura sobre obsesión, escritura y los fantasmas del pasado. A través de un ambiente cargado de misterio, la trama explora cómo la creación literaria puede convertirse en un espejo de los miedos más profundos y cómo las heridas del ayer pueden perseguir a quienes intentan olvidarlas.'),
(64,'9780000000074','Anagrama','2011-05-03','Carlos Ruiz Zafón',384,18,4,
'Un relato que conecta vidas y secretos a través de un pasado que vuelve para ser revelado. Con una atmósfera envolvente y personajes marcados por la pérdida, la novela muestra cómo las historias se entrelazan en un laberinto de emociones, silencios y verdades ocultas.'),
(65,'9780000000075','Minotauro','2016-05-04','Carlos Ruiz Zafón',928,19,5,
'Un cierre épico que une destinos, misterios y memorias en un final inolvidable. La obra culmina décadas de secretos familiares, amores imposibles y tragedias silenciosas, revelando cómo cada pieza encaja en un rompecabezas que trasciende generaciones.'),
(66,'9780000000076','Penguin Random House','2003-05-05','Dan Brown',592,20,1,
'Un thriller que mezcla arte, religión y conspiraciones en una carrera contrarreloj. Entre símbolos ocultos, pistas históricas y revelaciones sorprendentes, la historia invita a cuestionar la verdad oficial y a explorar los límites entre fe, ciencia y poder.'),
(67,'9780000000077','Debolsillo','2000-05-06','Dan Brown',624,21,2,
'Una historia donde ciencia y fe chocan en un conflicto lleno de secretos y símbolos. A través de enigmas que desafían la lógica y amenazas que se ciernen sobre el mundo, la novela plantea dilemas éticos que ponen en juego el futuro de la humanidad.'),
(68,'9780000000078','Plaza & Janés','2013-05-07','Dan Brown',480,22,3,
'Una aventura que combina historia, arte y amenazas globales en un rompecabezas mortal. El protagonista debe descifrar códigos, enfrentar traiciones y desentrañar conspiraciones que se ocultan detrás de obras maestras y mitos ancestrales.'),
(69,'9780000000079','Lumen','2009-05-08','Dan Brown',672,23,4,
'Un misterio que explora sociedades secretas y conocimientos antiguos ocultos durante siglos. La trama revela cómo el poder del conocimiento puede moldear civilizaciones enteras y cómo ciertos secretos han sido protegidos a cualquier precio.'),
(70,'9780000000080','RBA','2015-05-09','Paula Hawkins',416,1,5,
'Un thriller psicológico que juega con la memoria, la sospecha y la percepción de la realidad. A través de voces fragmentadas y recuerdos inciertos, la historia muestra cómo la verdad puede distorsionarse cuando el miedo, la culpa y la obsesión se entrelazan.'),
(71,'9780000000081','Planeta','2012-05-10','Gillian Flynn',432,2,1,
'Una historia inquietante sobre manipulación, secretos y la complejidad de las relaciones humanas. La novela explora cómo la apariencia puede ocultar intenciones oscuras y cómo la verdad puede convertirse en un arma peligrosa en manos equivocadas.'),
(72,'9780000000082','Alfaguara','2018-05-11','A.J. Finn',448,3,2,
'Un relato sobre aislamiento, paranoia y la delgada línea entre verdad e imaginación. Encerrada en su propio mundo, la protagonista observa vidas ajenas desde la distancia, hasta que un suceso inesperado la obliga a cuestionar todo lo que creía ver y saber.'),
(73,'9780000000083','Salamandra','1988-05-12','Thomas Harris',368,4,3,
'Un thriller icónico que explora la mente criminal y el miedo más profundo. La historia enfrenta a una joven investigadora con un asesino brillante y perturbador, revelando cómo la inteligencia puede ser tan peligrosa como la violencia.'),
(74,'9780000000084','Anagrama','1999-05-13','Thomas Harris',544,5,4,
'Una continuación intensa que profundiza en la obsesión, el poder y la oscuridad humana. La novela desentraña los límites entre cazador y presa, mostrando cómo la fascinación puede convertirse en una fuerza tan destructiva como irresistible.'),
(75,'9780000000085','Minotauro','2003-05-14','John Katzenbach',512,6,5,
'Un suspenso psicológico donde la identidad y la supervivencia se entrelazan en un juego mortal. La trama sigue a personajes atrapados en una red de engaños, donde cada movimiento puede significar la diferencia entre escapar o caer en manos del peligro.'),
(76,'9780000000086','Penguin Random House','2019-05-15','Alex Michaelides',336,7,1,
'Un thriller que gira en torno al silencio, el trauma y una verdad inesperada. A través de una investigación obsesiva, la historia revela cómo un acto inexplicable puede esconder heridas profundas y secretos que transforman por completo la percepción de los hechos.'),
(77,'9780000000087','Debolsillo','2017-05-16','C.J. Tudor',352,8,2,
'Una historia que mezcla infancia, secretos y las consecuencias de un pasado que nunca muere. La novela explora cómo los recuerdos pueden convertirse en amenazas cuando resurgen en forma de pistas inquietantes y figuras que regresan desde la oscuridad.'),
(78,'9780000000088','Plaza & Janés','2018-05-17','J.D. Barker',528,9,3,
'Una investigación frenética contra un asesino meticuloso que siempre va un paso por delante. Con giros inesperados y una tensión creciente, la historia muestra cómo la obsesión por descubrir la verdad puede convertirse en una carrera contra el tiempo.'),
(79,'9780000000089','Lumen','2020-05-18','Javier Castillo',416,10,4,
'Un thriller ambientado en Nueva York donde una desaparición abre la puerta a una verdad inquietante. Entre pistas confusas, secretos familiares y revelaciones impactantes, la novela mantiene un ritmo vertiginoso que atrapa desde el primer momento.'),
(80,'9780000000090','RBA','2006-05-19','Stieg Larsson',672,11,5,
'Un relato oscuro sobre corrupción, secretos familiares y la búsqueda incansable de justicia. La historia sigue a personajes marcados por el dolor y la determinación, que se enfrentan a una red de mentiras capaz de destruir vidas enteras.'),

(81,'9780000000091','Planeta','2024-05-20','Stieg Larsson',672,12,1,
'Un thriller que destapa corrupción, secretos familiares y una búsqueda incansable de justicia. A través de una investigación que se adentra en las zonas más oscuras del poder, la historia muestra cómo la verdad puede convertirse en un arma peligrosa cuando amenaza a quienes viven de las mentiras.'),
(82,'9780000000092','Alfaguara','2024-05-21','Stieg Larsson',720,13,2,
'Una segunda entrega llena de tensión, investigación y revelaciones que cambian todo. Los protagonistas se enfrentan a nuevas conspiraciones mientras intentan sobrevivir en un entorno donde cada pista abre la puerta a un peligro mayor y cada verdad tiene un precio.'),
(83,'9780000000093','Salamandra','2024-05-22','Stieg Larsson',848,14,3,
'Un cierre explosivo donde la verdad, el poder y la supervivencia chocan sin descanso. La historia culmina en una batalla contra fuerzas que operan desde las sombras, revelando cómo la valentía puede desafiar incluso a los enemigos más implacables.'),
(84,'9780000000094','Anagrama','2024-05-23','Umberto Eco',592,15,4,
'Un misterio medieval que mezcla filosofía, crimen y una profunda reflexión sobre el conocimiento. En un monasterio lleno de secretos, la investigación de una serie de muertes revela cómo la fe, la razón y el poder pueden enfrentarse en un juego mortal.'),
(85,'9780000000095','Minotauro','2024-05-24','Umberto Eco',544,16,5,
'Una aventura histórica llena de humor, fantasía y engaños que desafían la realidad. A través de manuscritos perdidos, conspiraciones y personajes extravagantes, la novela invita a cuestionar la verdad y a disfrutar del placer del relato.'),
(86,'9780000000096','Penguin Random House','2024-05-25','Umberto Eco',656,17,1,
'Una novela compleja que explora conspiraciones, símbolos y la obsesión por el conocimiento oculto. La trama se adentra en sociedades secretas, teorías imposibles y laberintos intelectuales que muestran cómo la mente humana puede perderse en su propia búsqueda de sentido.'),
(87,'9780000000097','Debolsillo','2024-05-26','Patrick Süskind',304,18,2,
'Una historia inquietante sobre obsesión, aroma y el poder que puede ejercer un solo individuo. La novela retrata cómo un talento extraordinario puede convertirse en una maldición cuando se utiliza para dominar, manipular y trascender los límites de la humanidad.'),
(88,'9780000000098','Plaza & Janés','2024-05-27','Muriel Barbery',336,19,3,
'Un relato sensible que reflexiona sobre belleza, filosofía y encuentros inesperados. A través de personajes que buscan sentido en lo cotidiano, la historia revela cómo los pequeños gestos pueden transformar vidas enteras.'),
(89,'9780000000099','Lumen','2024-05-28','Haruki Murakami',384,20,4,
'Una historia íntima sobre amor, pérdida y el tránsito hacia la madurez emocional. Con su estilo característico, el autor explora la soledad, los recuerdos y la fragilidad de los vínculos que nos acompañan a lo largo de la vida.'),
(90,'9780000000100','RBA','2024-05-29','Haruki Murakami',512,21,5,
'Una novela surrealista que mezcla destino, sueños y simbolismos en un mundo paralelo. La trama se mueve entre realidades que se tocan y se separan, invitando a reflexionar sobre la identidad, el azar y los caminos invisibles que guían nuestras decisiones.'),
(91,'9780000000101','Planeta','2024-05-30','Haruki Murakami',480,22,1,
'Un relato que profundiza en conexiones invisibles, enigmas y emociones contenidas. La historia avanza entre silencios, encuentros inesperados y símbolos que revelan la complejidad de los sentimientos humanos.'),
(92,'9780000000102','Alfaguara','2024-05-31','Ernest Hemingway',128,23,2,
'Una historia sobre lucha, dignidad y perseverancia frente a la inmensidad del mar. Con un estilo sobrio y poderoso, la novela muestra cómo la resistencia humana puede brillar incluso en los momentos más solitarios y desafiantes.'),
(93,'9780000000103','Salamandra','2024-06-01','Ernest Hemingway',480,1,3,
'Un relato bélico que combina amor, sacrificio y la crudeza de la guerra. La historia retrata cómo los sentimientos pueden sobrevivir en medio del caos y cómo la valentía se manifiesta en los gestos más simples.'),
(94,'9780000000104','Anagrama','2024-06-02','Ernest Hemingway',272,2,4,
'Una novela sobre desorientación, excesos y la búsqueda de sentido en un mundo cambiante. A través de personajes que intentan encontrar su lugar, la obra refleja la confusión y el desencanto de una generación marcada por la incertidumbre.'),
(95,'9780000000105','Minotauro','2024-06-03','Ernest Hemingway',352,3,5,
'Una historia intensa que mezcla guerra, amor y tragedia en un contexto devastador. La novela muestra cómo la fragilidad humana se enfrenta a la violencia del mundo y cómo el amor puede convertirse en un refugio efímero.'),
(96,'9780000000106','Penguin Random House','2024-06-04','F. Scott Fitzgerald',240,4,1,
'Un retrato brillante sobre ambición, amor y la decadencia de una época dorada. La historia captura el brillo superficial de una sociedad obsesionada con el éxito, mientras revela las grietas emocionales que se esconden detrás del lujo.'),
(97,'9780000000107','Debolsillo','2024-06-05','John Katzenbach',416,5,2,
'Un thriller psicológico que explora secretos, culpa y decisiones irreversibles. La trama se adentra en la mente humana para mostrar cómo los traumas del pasado pueden resurgir con fuerza y alterar el presente.'),
(98,'9780000000108','Plaza & Janés','2024-06-06','Cormac McCarthy',320,6,3,
'Un relato postapocalíptico sobre supervivencia, amor y esperanza en un mundo devastado. La historia sigue a personajes que luchan por mantener su humanidad mientras avanzan por un paisaje desolado donde cada día es una prueba.'),
(99,'9780000000109','Lumen','2024-06-07','Cormac McCarthy',256,7,4,
'Una historia cruda que examina violencia, moralidad y la fragilidad humana. Con un estilo directo y poético, la novela muestra cómo las decisiones extremas pueden revelar tanto la oscuridad como la luz que habita en cada persona.'),
(100,'9780000000110','RBA','2024-06-08','Cormac McCarthy',304,8,5,
'Un viaje emocional que enfrenta a sus protagonistas con la dureza del mundo y la necesidad de seguir adelante. La historia explora la pérdida, la resistencia y la esperanza que persiste incluso en los escenarios más sombríos.');


INSERT INTO marca (nombre_marca) VALUES
('Genérica'),
('Nike'),
('Samsonite'),
('Marvel'),
('Finocam'),
('Oxford'),
('Muji'),
('Mr Wonderful'),
('Post-it'),
('Papiro'),
('Moleskine'),
('Hallmark'),
('Navipack'),
('Pollen'),
('Avery'),
('Navigator'),
('HP'),
('Clairefontaine'),
('Canson'),
('Parker'),
('Montblanc'),
('Manuscript'),
('Rotring'),
('Winsor & Newton'),
('Faber-Castell'),
('Copic'),
('Pelikan'),
('Crayola'),
('Talens'),
('Da Vinci'),
('Jullian'),
('Arteza'),
('Casio'),
('Sharp'),
('Fellowes'),
('GBC'),
('Esselte'),
('Bankers Box'),
('Leitz'),
('Eastpak'),
('Totto'),
('BIC'),
('Staedtler');


-- ========== DATOS DE PAPELERIA ==========
INSERT INTO papeleria (id_producto, id_marca, id_categoria) VALUES
(101,1,1),
(102,2,1),
(103,3,1),
(104,4,1),

(105,5,2),
(106,6,2),
(107,7,2),
(108,8,2),

(109,6,3),
(110,6,3),
(111,6,3),
(112,9,3),
(113,10,3),
(114,11,3),

(115,12,4),
(116,13,4),
(117,14,4),
(118,15,4),

(119,16,5),
(120,17,5),
(121,18,5),
(122,19,5),

(123,20,6),
(124,21,6),
(125,22,6),
(126,23,6),

(127,24,7),
(128,25,7),
(129,26,7),
(130,19,7),
(131,27,7),
(132,28,7),

(133,29,8),
(134,30,8),
(135,31,8),
(136,32,8),

(137,33,9),
(138,34,9),
(139,35,9),
(140,36,9),

(141,37,10),
(142,37,10),
(143,15,10),
(144,38,10),
(145,39,10),

(146,40,11),
(147,41,11),
(148,25,11),

(149,42,12),
(150,43,12);


INSERT INTO detalle_pedido (id_pedido, id_producto, cantidad, precio_unidad) VALUES
(1, 1, 2, 19.99),
(1, 2, 1, 22.50),
(1, 4, 1, 15.00),
(2, 5, 3, 12.00),
(2, 6, 5, 3.50),
(3, 7, 10, 1.20),
(3, 8, 10, 1.20),
(3, 9, 8, 0.90),
(3, 10, 6, 2.50),
(4, 11, 2, 13.00),
(5, 12, 1, 16.00),
(5, 14, 1, 20.00),
(5, 17, 2, 2.20),
(6, 19, 1, 17.00),
(6, 20, 1, 17.00),
(7, 21, 1, 25.00),
(7, 22, 1, 28.00),
(8, 24, 5, 1.50),
(8, 25, 3, 2.80),
(8, 26, 4, 1.00),
(8, 28, 2, 2.50),
(8, 30, 2, 4.00),
(9, 31, 1, 35.00),
(9, 32, 1, 32.00),
(9, 33, 1, 38.00),
(10, 40, 1, 27.00);


INSERT INTO facturas (num_factura, fecha_factura, precio_total, id_pedido) VALUES
('FAC-2024-001', '2024-01-15', 72.48, 1),
('FAC-2024-002', '2024-02-20', 53.50, 2),
('FAC-2024-003', '2024-03-10', 46.20, 3),
('FAC-2024-005', '2024-05-12', 40.40, 5),
('FAC-2024-006', '2024-06-18', 34.00, 6),
('FAC-2024-008', '2024-08-30', 52.90, 8),
('FAC-2024-009', '2024-09-15', 105.00, 9);
