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

-- ============================================
-- PARTE 1: 100 PRODUCTOS (50 libros + 50 papelería)
-- ============================================

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
('Snow Crash','Ciberpunk frenético sobre tecnología, lenguaje y caos digital.','LIBRO',20.90,35,'AGOTADO','2024-04-09',14.50);



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
(1,'9780000000011','Planeta','2001-05-12','Jane Austen',432,1,1,'Una historia que examina con delicadeza las tensiones sociales y emocionales de una época marcada por las apariencias y los prejuicios.'),
(2,'9780000000012','Alfaguara','1998-03-22','Harper Lee',384,2,2,'Un relato que combina inocencia y crudeza para mostrar cómo la justicia puede verse distorsionada por el miedo y la desigualdad.'),
(3,'9780000000013','Salamandra','2005-11-10','George Orwell',328,3,3,'Una visión inquietante de un futuro donde la libertad se diluye bajo un sistema que controla cada pensamiento y cada gesto.'),
(4,'9780000000014','Anagrama','1999-07-18','George Orwell',144,4,4,'Una fábula que revela cómo el poder puede corromper incluso las causas más nobles cuando la ambición supera a la ética.'),
(5,'9780000000015','Minotauro','2003-02-14','Fiódor Dostoyevski',672,5,5,'Un viaje profundo a la mente humana donde la culpa, el miedo y la moralidad se enfrentan en un conflicto devastador.'),
(6,'9780000000016','Penguin Random House','2007-09-03','Fiódor Dostoyevski',824,6,1,'Una obra monumental que explora la fe, la duda y los lazos familiares en un mundo lleno de contradicciones.'),
(7,'9780000000017','Debolsillo','2010-04-27','León Tolstói',1225,7,2,'Una epopeya que entrelaza destinos personales con los grandes acontecimientos históricos que transforman naciones enteras.'),
(8,'9780000000018','Plaza & Janés','2004-08-19','León Tolstói',864,8,3,'Una historia intensa donde la pasión y las normas sociales chocan, revelando las consecuencias de seguir los dictados del corazón.'),
(9,'9780000000019','Lumen','1997-12-05','Gustave Flaubert',392,9,4,'Un retrato íntimo de una mujer atrapada entre sus deseos y las limitaciones de una sociedad que no le permite soñar.'),
(10,'9780000000020','RBA','2002-06-30','Oscar Wilde',256,10,5,'Una reflexión sobre la belleza, la corrupción y el precio que se paga por ignorar las consecuencias de los propios actos.'),
(11,'9780000000021','Planeta','2008-03-11','Gabriel García Márquez',496,11,1,'Una saga familiar donde lo mágico y lo cotidiano se entrelazan para mostrar la fragilidad del tiempo y la memoria.'),
(12,'9780000000022','Alfaguara','2006-10-09','Gabriel García Márquez',368,12,2,'Un relato que celebra la persistencia del amor incluso cuando los años transforman cuerpos, vidas y esperanzas.'),
(13,'9780000000023','Salamandra','2012-01-17','Isabel Allende',448,13,3,'Una historia que mezcla política, emociones y espiritualidad para retratar generaciones marcadas por la fuerza del destino.'),
(14,'9780000000024','Anagrama','2000-09-25','Julio Cortázar',600,14,4,'Una novela que rompe las reglas tradicionales y convierte la lectura en un juego lleno de caminos posibles.'),
(15,'9780000000025','Minotauro','1995-04-03','Juan Rulfo',124,15,5,'Un relato breve y poderoso donde las voces del pasado resuenan en un pueblo marcado por la ausencia y el misterio.'),
(16,'9780000000026','Penguin Random House','2011-07-14','Jorge Luis Borges',224,16,1,'Una colección de relatos que desafían la lógica y exploran mundos donde el tiempo, el lenguaje y la realidad se entrelazan.'),
(17,'9780000000027','Debolsillo','2009-02-28','Mario Vargas Llosa',480,17,2,'Una crítica social que revela la dureza de un entorno militar y la complejidad de las relaciones humanas.'),
(18,'9780000000028','Plaza & Janés','1996-11-08','Ernesto Sabato',160,18,3,'Una mirada profunda a la mente de un hombre consumido por la obsesión y la incapacidad de conectar con el mundo.'),
(19,'9780000000029','Lumen','2013-05-21','Laura Esquivel',256,19,4,'Una historia donde los sentimientos se expresan a través de sabores, gestos y tradiciones que marcan cada capítulo.'),
(20,'9780000000030','RBA','2001-01-29','Roberto Bolaño',672,20,5,'Un viaje literario que sigue a jóvenes poetas en su búsqueda de identidad, libertad y un lugar en el mundo.'),

(21,'9780000000031','Planeta','2002-05-12','J.R.R. Tolkien',1216,21,1,'Una epopeya que sigue la lucha entre fuerzas antiguas mientras un grupo diverso emprende un viaje que definirá el destino de su mundo.'),
(22,'9780000000032','Alfaguara','1999-03-22','J.R.R. Tolkien',310,22,2,'Una aventura que comienza en la tranquilidad de un hogar y se transforma en un viaje lleno de peligros, magia y descubrimientos.'),
(23,'9780000000033','Salamandra','2001-11-10','J.K. Rowling',320,23,3,'La historia de un niño que descubre un mundo oculto donde la magia convive con desafíos que pondrán a prueba su valentía.'),
(24,'9780000000034','Anagrama','2003-07-18','J.K. Rowling',352,24,4,'Una nueva amenaza surge en Hogwarts, revelando secretos que conectan el pasado con los peligros del presente.'),
(25,'9780000000035','Minotauro','2005-02-14','George R.R. Martin',694,25,5,'Un relato donde la ambición y la traición moldean un mundo en el que cada decisión puede significar vida o muerte.'),
(26,'9780000000036','Penguin Random House','1998-09-03','C.S. Lewis',768,26,1,'Una saga que combina fantasía, valores humanos y criaturas míticas para narrar un viaje lleno de significado.'),
(27,'9780000000037','Debolsillo','2007-04-27','Robert Jordan',832,27,2,'Una historia que entrelaza destinos y profecías en un universo donde el tiempo fluye en ciclos eternos.'),
(28,'9780000000038','Plaza & Janés','2010-08-19','Patrick Rothfuss',662,28,3,'Un relato íntimo donde un joven prodigio narra su vida marcada por tragedias, aprendizajes y un talento excepcional.'),
(29,'9780000000039','Lumen','1996-12-05','Michael Ende',448,29,4,'Una aventura que invita a reflexionar sobre imaginación, identidad y el poder de las historias.'),
(30,'9780000000040','RBA','2004-06-30','Neil Gaiman',624,30,5,'Una mezcla de mitología y modernidad que cuestiona la fe, la identidad y el papel de los dioses en un mundo cambiante.'),
(31,'9780000000041','Planeta','2008-03-11','Frank Herbert',688,1,1,'Una epopeya que combina política, ecología y espiritualidad en un planeta donde cada recurso es motivo de conflicto.'),
(32,'9780000000042','Alfaguara','2006-10-09','Ray Bradbury',256,2,2,'Una advertencia sobre los peligros de la censura y la pérdida del pensamiento crítico en una sociedad controlada.'),
(33,'9780000000043','Salamandra','2012-01-17','William Gibson',336,3,3,'Una visión futurista donde tecnología, identidad y poder se entrelazan en un mundo dominado por el ciberespacio.'),
(34,'9780000000044','Anagrama','2000-09-25','Isaac Asimov',255,4,4,'Una obra que explora el ascenso y caída de imperios mediante la ciencia, la predicción y la razón.'),
(35,'9780000000045','Minotauro','1995-04-03','Isaac Asimov',320,5,5,'Una colección de relatos que examinan la relación entre humanos y máquinas, cuestionando la ética y la lógica.'),
(36,'9780000000046','Penguin Random House','2011-07-14','Arthur C. Clarke',240,6,1,'Una historia que reflexiona sobre el futuro de la humanidad y los límites de la evolución.'),
(37,'9780000000047','Debolsillo','2009-02-28','Dan Simmons',482,7,2,'Una novela coral que mezcla religión, misterio y ciencia ficción en un viaje hacia lo desconocido.'),
(38,'9780000000048','Plaza & Janés','1996-11-08','Orson Scott Card',352,8,3,'Un relato sobre estrategia, presión y crecimiento personal en un entorno donde el juego y la guerra se confunden.'),
(39,'9780000000049','Lumen','2013-05-21','Ursula K. Le Guin',304,9,4,'Una historia que explora identidad, género y política en un mundo donde las diferencias son esenciales para comprenderse.'),
(40,'9780000000050','RBA','2001-01-29','Neal Stephenson',480,10,5,'Una aventura ciberpunk que combina lenguaje, tecnología y caos en un mundo hiperconectado.');



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
-- Mochilas
(51,1,1),
(52,2,1),
(53,3,1),
(54,4,1),

-- Agendas
(55,5,2),
(56,6,2),
(57,7,2),
(58,8,2),

-- Cuadernos, libretas y recambios
(59,6,3),
(60,6,3),
(61,6,3),
(62,9,3),
(63,10,3),
(64,11,3),

-- Papelería de regalo
(65,12,4),
(66,13,4),
(67,14,4),
(68,15,4),

-- Papel
(69,16,5),
(70,17,5),
(71,18,5),
(72,19,5),

-- Alta escritura
(73,20,6),
(74,21,6),
(75,22,6),
(76,23,6),

-- Creatividad
(77,24,7),
(78,25,7),
(79,26,7),
(80,19,7),
(81,27,7),
(82,28,7),

-- Bellas Artes
(83,29,8),
(84,30,8),
(85,31,8),
(86,32,8),

-- Calculadoras y máquinas de oficina
(87,33,9),
(88,34,9),
(89,35,9),
(90,36,9),

-- Archivo y clasificación
(91,37,10),
(92,37,10),
(93,15,10),
(94,38,10),
(95,39,10),

-- Estuches
(96,40,11),
(97,41,11),
(98,25,11),

-- Escritura escolar
(99,42,12),
(100,43,12);


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
