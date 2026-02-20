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
    total DECIMAL(12,2) NOT NULL, -- total pedido
    id_usuario int,
    foreign key (id_usuario) references usuarios(id_usuario)
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

CREATE TABLE imagenes_producto (
    id_imagen int not null auto_increment primary key,
    id_producto int not null,
    tipo ENUM('PRINCIPAL', 'MINIATURA') not null,
    ruta varchar(255) not null,
    foreign key (id_producto) references productos(id_producto)
);

CREATE TABLE genero (
	id_genero int auto_increment primary key not null,
    nombre_genero varchar(100) not null
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

CREATE TABLE categoria(
	id_categoria int auto_increment primary key not null,
	nombre_categoria varchar(100) not null
);

CREATE TABLE papeleria (
	id_producto int primary key not null,
	id_marca int ,
    id_categoria int,
    descripcion_larga text,
    foreign key (id_categoria) references categoria(id_categoria),
    foreign key (id_producto) references productos(id_producto),
    foreign key (id_marca) references marca(id_marca)
);

CREATE TABLE favoritos (
    id_usuario INT NOT NULL,
    id_producto INT NOT NULL,
    PRIMARY KEY (id_usuario, id_producto),
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario),
    FOREIGN KEY (id_producto) REFERENCES productos(id_producto)
);

create table detalle_pedido(
	id_detalle_pedido int primary key auto_increment not null,
	id_pedido int not null,
    id_producto int not null,
    cantidad int not null, -- cantidad de un pedido
    precio_unidad dec(12,2) not null, -- precio de cada unidad del producto
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


INSERT INTO usuarios 
(username, password, nombre, apellidos, enabled, fecha_registro, fecha_nacimiento, direccion, email, id_perfil) VALUES
('tomas', '{noop}tomasin', 'Tomas', 'Escu', 1, '2025-11-05', '1960-11-02', 'madrid', 'tomas@ifp.com', 1),
('sarita', '{noop}sarita', 'Sara', 'Baras', 1, '2024-02-05', '1999-03-16', 'sevilla', 'sara@ifp.com', 2),
('eva', '{noop}evita', 'Eva', 'Goma', 1, '2000-01-02', '1978-05-24', 'cordoba', 'eva@ifp.com', 3),
('ramon', '{noop}ramoncin', 'Ramon', 'González', 1, '2014-07-07', '1996-06-04', 'madrid','ramon@ifp.com', 4);


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


-- ========== 30 LIBROS ==========
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
('American Gods','Fantasía contemporánea que mezcla mitología y crítica social.','LIBRO',19.90,35,'AGOTADO','2024-03-30',13.50);

-- ========== 20 PAPELERÍA ==========
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
('Papel fotográfico', 'Pack 20 hojas glossy A4', 'PAPELERIA', 12.90, 45, 'DISPONIBLE', '2024-03-29', 9.00);


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
'Una epopeya que sigue la lucha entre fuerzas antiguas mientras un grupo diverso emprende un viaje que definirá el destino de su mundo. A través de paisajes míticos, alianzas improbables y amenazas que resurgen desde las sombras, 
la historia explora el valor, la amistad y el sacrificio que exige enfrentarse al mal en su forma más pura. Con una narrativa rica en simbolismo y tradición, la obra muestra cómo incluso los seres más humildes pueden influir en 
el curso de la historia cuando la oscuridad amenaza con consumirlo todo. Es un relato sobre esperanza, resistencia y la fuerza que nace de la unidad.'),
(22,'9780000000032','Alfaguara','1999-03-22','J.R.R. Tolkien',310,22,2,
'Una aventura que comienza en la tranquilidad de un hogar y se transforma en un viaje lleno de peligros, magia y descubrimientos. El protagonista, arrancado de su rutina, se ve obligado a confrontar criaturas desconocidas y 
desafíos que pondrán a prueba su ingenio, su coraje y su capacidad para aceptar un destino que nunca imaginó. A medida que avanza, descubre que el mundo es más vasto y complejo de lo que creía, y que incluso los actos más 
pequeños pueden tener consecuencias inmensas. Es una historia sobre crecimiento, valentía y la inesperada grandeza que puede surgir de lo cotidiano.'),
(23,'9780000000033','Salamandra','2001-11-10','J.K. Rowling',320,23,3,
'La historia de un niño que descubre un mundo oculto donde la magia convive con desafíos que pondrán a prueba su valentía. Entre amistades nuevas, misterios que se esconden en cada pasillo y secretos que rodean su propio origen, 
el protagonista aprende que el valor no consiste en no tener miedo, sino en enfrentarlo. La novela combina humor, emoción y aventura para mostrar cómo la amistad, la lealtad y la curiosidad pueden iluminar incluso los momentos 
más oscuros. Es el inicio de un viaje que transformará su vida para siempre.'),
(24,'9780000000034','Anagrama','2003-07-18','J.K. Rowling',352,1,4,
'Una nueva amenaza surge en Hogwarts, revelando secretos que conectan el pasado con los peligros del presente. Mientras el protagonista intenta comprender su papel en un conflicto que crece en las sombras, la historia profundiza 
en la lealtad, la identidad y el peso de las decisiones que pueden cambiar el rumbo del mundo mágico. Con giros inesperados, tensiones crecientes y revelaciones que desafían todo lo conocido, la novela muestra cómo el coraje y 
la verdad pueden abrirse paso incluso cuando la oscuridad parece invencible.'),
(25,'9780000000035','Minotauro','2005-02-14','George R.R. Martin',694,2,5,
'Un relato donde la ambición y la traición moldean un mundo en el que cada decisión puede significar vida o muerte. Entre intrigas políticas, alianzas frágiles y personajes que luchan por sobrevivir en un entorno despiadado, la 
historia muestra cómo el poder puede convertirse en una carga tan peligrosa como irresistible. Con una narrativa cruda y realista, la novela revela la complejidad de los deseos humanos y la fragilidad de la moral en tiempos de 
conflicto. Es un retrato implacable de un mundo donde nadie está a salvo.'),
(26,'9780000000036','Penguin Random House','1998-09-03','C.S. Lewis',768,3,1,
'Una saga que combina fantasía, valores humanos y criaturas míticas para narrar un viaje lleno de significado. A través de reinos encantados, batallas simbólicas y encuentros con seres extraordinarios, la obra invita a reflexionar sobre la fe, la valentía y la importancia de creer en aquello que no siempre se puede ver.'),
(27,'9780000000037','Debolsillo','2007-04-27','Robert Jordan',832,4,2,
'Una historia que entrelaza destinos y profecías en un universo donde el tiempo fluye en ciclos eternos. Con un elenco amplio y complejo, la novela explora la lucha entre la luz y la sombra, mostrando cómo incluso los actos más pequeños pueden alterar el curso de un mundo que se enfrenta a su propia renovación.'),
(28,'9780000000038','Plaza & Janés','2010-08-19','Patrick Rothfuss',662,5,3,
'Un relato íntimo donde un joven prodigio narra su vida marcada por tragedias, aprendizajes y un talento excepcional. A través de recuerdos que mezclan dolor, descubrimiento y una búsqueda incansable de conocimiento, la historia revela cómo se forja una leyenda en un mundo donde la música, la magia y la palabra tienen un poder inmenso.'),
(29,'9780000000039','Lumen','1996-12-05','Michael Ende',448,6,4,
'Una aventura que invita a reflexionar sobre imaginación, identidad y el poder de las historias. En un mundo donde la fantasía y la realidad se entrelazan, el protagonista descubre que los relatos pueden transformar no solo el destino de los personajes, sino también el de quienes se atreven a creer en ellos.'),
(30,'9780000000040','RBA','2004-06-30','Neil Gaiman',624,7,5,
'Una mezcla de mitología y modernidad que cuestiona la fe, la identidad y el papel de los dioses en un mundo cambiante. La novela explora cómo las creencias evolucionan con el tiempo y cómo las figuras divinas deben adaptarse a una sociedad que ya no las recuerda, mientras fuerzas antiguas y nuevas compiten por sobrevivir.');

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
INSERT INTO papeleria (id_producto, id_marca, id_categoria, descripcion_larga) VALUES
(31,1,1,
'[Ligera y portátil] Mochila escolar para niñas de color liso: 31 x 18 x 45 cm/12,2"x7,1"x17,7" (largo x ancho x alto). Capacidad aproximada: admite un portátil de hasta 15,6 pulgadas. Pesa 750 g, lo que la hace fácil de transportar.
[Gran capacidad y múltiples bolsillos] El bolsillo principal incluye un compartimento para portátil. Incluye un bolsillo para el móvil, un bolsillo con cierre a presión, dos bolsillos frontales con cremallera y un bolsillo trasero con cremallera. También cuenta con dos bolsillos laterales con hebilla ajustable. Espacio suficiente para guardar botellas de agua, paraguas, libros y otros artículos de papelería.
[Materiales de primera calidad] Fabricada en poliéster compuesto de alta densidad y alta calidad, resistente a la deformación. Cremalleras suaves, cinturón elástico trasero compatible con maletas con ruedas, correas de hombro y asa con costuras reforzadas para transportar objetos pesados.
[Diseño ergonómico] Correa en forma de S que protege la espalda y la columna vertebral. Los paneles de malla transpirable favorecen la circulación del aire y absorben el sudor para mayor comodidad en los días calurosos. Asa superior de descompresión suave para un agarre fácil y correas de hombro anchas, ajustables y transpirables que brindan mayor comodidad a esta mochila escolar para niñas y alivian la carga de tu hija.
[Sorpresa para niñas] Diseño simple de color liso con un encantador llavero, con un toque vibrante y juvenil, ideal para adolescentes que van a la escuela, de compras, citas, viajes, camping, conducir, etc. Se puede usar como mochila escolar, mochila de diario o mochila informal.'),
(32,2,1,
'Correas de hombro acolchadas y ajustables
Gran compartimento principal
Tejido duradero
Detalles distintivos de la marca'),
(33,3,1,
'Multifuncional: La bolsa para computadora portátil de 17,3 pulgadas proporciona 1 compartimento grande con 5 bolsillos pequeños para guardar sus pertenencias como iPad, bolígrafos, llaves. El compartimento principal puede contener carpetas de archivos grandes y cuadernos. La funda para computadora portátil separada es lo suficientemente grande para transportar computadoras portátiles de 17, 15.6, 15 pulgadas compatibles para Dell, HP, Asus, Lenovo, Toshiba, Acer, Samsung, Sony, MacBook
Resistente al agua Duradero: Este bolso para hombre está hecho de un material de tela de nailon ligero y de alta calidad. Ofrece una experiencia de textura de gran comodidad y muestra moda y estilo
Práctico y Seguro: La correa para equipaje facilita sujetar el bolso a tu maleta, mientras que su bolsillo antirrobo oculto garantiza la protección de tus pertenencias más valiosas
Protección Superior: Un acolchado de espuma de 0,5 cm de grosor con un cierre de pasador de nailon protege su portátil de arañazos y es a prueba de golpes. Bien puede evitar que su computadora portátil se dañe en cualquier momento
Cómodo y Conveniente: Con un diseño simple y elegante, esta bolsa para computadora portátil con múltiples bolsillos es adecuada para personas de diferentes edades. Como maletín para portátil todo en uno, será el compañero perfecto para hombres, mujeres, profesores y empresarios'),
(34,4,1,
'GARANTÍA Y CALIDAD: SPIDER-MAN Oficial mochila infantil escolar para niños en guardería con 2 años de garantía
DISEÑO ÚNICO: Confeccionada con un material de poliéster muy resistente y cremalleras suaves. Fácil de lavar
ESPACIOSA Y LIGERA: Tiradores en los cursores para facilitar su apertura. Doble tirador en cremallera principal. Costuras reforzadas
ERGONOMÍA Y COMODIDAD: Mochila adaptable a carro Safta (Ultraligero y Ruedas PVC). Asa de mano en la parte superior y tarjeta de identificación personal
RESISTENCIA Y DURABILIDAD: Este producto está especialmente diseñado pensando en su durabilidad, elaborado con materiales de alta resistencia para asegurar que se pueda utilizar en todo tipo de actividades, garantizando su funcionalidad'),

(35,5,2,''),
(36,6,2,''),
(37,7,2,''),
(38,8,2,''),

(39,6,3,''),
(40,6,3,''),
(41,6,3,''),
(42,9,3,''),
(43,10,3,''),
(44,11,3,''),

(45,12,4,''),
(46,13,4,''),
(47,14,4,''),
(48,15,4,''),

(49,16,5,''),
(50,17,5,'');

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
('2024-10-10','CANCELADO',23.55,2),
('2024-11-10','CANCELADO',23.55,2),
('2024-12-10','CANCELADO',23.55,2);

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
(9, 50, 1, 38.00),
(10, 40, 1, 2.80),
(11, 27, 7, 8.90),
(12, 23, 3, 4.50);


-- ========== DATOS DE LIBRO ==========
INSERT INTO imagenes_producto (id_producto, tipo, ruta) VALUES
(1, 'PRINCIPAL', 'libros/orgullo_y_prejuicio.jpg'),
(1, 'MINIATURA', 'libros/orgullo_y_prejuicio_m1.jpg'),
(1, 'MINIATURA', 'libros/orgullo_y_prejuicio_m2.jpg'),
(1, 'MINIATURA', 'libros/orgullo_y_prejuicio_m3.jpg'),

(2, 'PRINCIPAL', 'libros/matar_a_un_ruiseñor.jpg'),
(2, 'MINIATURA', 'libros/matar_a_un_ruiseñor_m1.jpg'),
(2, 'MINIATURA', 'libros/matar_a_un_ruiseñor_m2.jpg'),

(3, 'PRINCIPAL', 'libros/1984.jpg'),
(3, 'MINIATURA', 'libros/1984_m1.jpg'),
(3, 'MINIATURA', 'libros/1984_m2.jpg'),

(4, 'PRINCIPAL', 'libros/rebelion_en_la_granja.jpg'),
(4, 'MINIATURA', 'libros/rebelion_en_la_granja_m1.jpg'),
(4, 'MINIATURA', 'libros/rebelion_en_la_granja_m2.jpg'),

(5, 'PRINCIPAL', 'libros/crimen_y_castigo.jpg'),
(5, 'MINIATURA', 'libros/crimen_y_castigo_m1.jpg'),
(5, 'MINIATURA', 'libros/crimen_y_castigo_m2.jpg'),

(6, 'PRINCIPAL', 'libros/hermanos_karamazov.jpg'),
(6, 'MINIATURA', 'libros/hermanos_karamazov_m1.jpg'),
(6, 'MINIATURA', 'libros/hermanos_karamazov_m2.jpg'),

(7, 'PRINCIPAL', 'libros/guerra_y_paz.jpg'),
(7, 'MINIATURA', 'libros/guerra_y_paz_m1.jpg'),
(7, 'MINIATURA', 'libros/guerra_y_paz_m2.jpg'),
(7, 'MINIATURA', 'libros/guerra_y_paz_m3.jpg'),
(7, 'MINIATURA', 'libros/guerra_y_paz_m4.jpg'),

(8, 'PRINCIPAL', 'libros/anna_karenina.jpg'),
(8, 'MINIATURA', 'libros/anna_karenina_m1.jpg'),
(8, 'MINIATURA', 'libros/anna_karenina_m2.jpg'),

(9, 'PRINCIPAL', 'libros/madame_bovary.jpg'),
(9, 'MINIATURA', 'libros/madame_bovary_m1.jpg'),
(9, 'MINIATURA', 'libros/madame_bovary_m2.jpg'),

(10, 'PRINCIPAL', 'libros/retrato_dorian_gray.jpg'),
(10, 'MINIATURA', 'libros/retrato_dorian_gray_m1.jpg'),
(10, 'MINIATURA', 'libros/retrato_dorian_gray_m2.jpg'),

(11, 'PRINCIPAL', 'libros/cien_años_soledad.jpg'),
(11, 'MINIATURA', 'libros/cien_años_soledad_m1.jpg'),
(11, 'MINIATURA', 'libros/cien_años_soledad_m2.jpg'),
(11, 'MINIATURA', 'libros/cien_años_soledad_m3.jpg'),

(12, 'PRINCIPAL', 'libros/amor_tiempos_colera.jpg'),
(12, 'MINIATURA', 'libros/amor_tiempos_colera_m1.jpg'),
(12, 'MINIATURA', 'libros/amor_tiempos_colera_m2.jpg'),
(12, 'MINIATURA', 'libros/amor_tiempos_colera_m3.jpg'),

(13, 'PRINCIPAL', 'libros/casa_espiritus.jpg'),
(13, 'MINIATURA', 'libros/casa_espiritus_m1.jpg'),
(13, 'MINIATURA', 'libros/casa_espiritus_m2.jpg'),
(13, 'MINIATURA', 'libros/casa_espiritus_m3.jpg'),
(13, 'MINIATURA', 'libros/casa_espiritus_m4.jpg'),

(14, 'PRINCIPAL', 'libros/rayuela.jpg'),
(14, 'MINIATURA', 'libros/rayuela_m1.jpg'),
(14, 'MINIATURA', 'libros/rayuela_m2.jpg'),

(15, 'PRINCIPAL', 'libros/pedro_paramo.jpg'),
(15, 'MINIATURA', 'libros/pedro_paramo_m1.jpg'),
(15, 'MINIATURA', 'libros/pedro_paramo_m2.jpg'),
(15, 'MINIATURA', 'libros/pedro_paramo_m3.jpg'),

(16, 'PRINCIPAL', 'libros/ficciones.jpg'),
(16, 'MINIATURA', 'libros/ficciones_m1.jpg'),
(16, 'MINIATURA', 'libros/ficciones_m2.jpg'),

(17, 'PRINCIPAL', 'libros/ciudad_y_perros.jpg'),

(18, 'PRINCIPAL', 'libros/el_tunel.jpg'),
(18, 'MINIATURA', 'libros/el_tunel_m1.jpg'),
(18, 'MINIATURA', 'libros/el_tunel_m2.jpg'),

(19, 'PRINCIPAL', 'libros/como_agua_para_chocolate.jpg'),
(19, 'MINIATURA', 'libros/como_agua_para_chocolate_m1.jpg'),
(19, 'MINIATURA', 'libros/como_agua_para_chocolate_m2.jpg'),

(20, 'PRINCIPAL', 'libros/detectives_salvajes.jpg'),
(20, 'MINIATURA', 'libros/detectives_salvajes_m1.jpg'),
(20, 'MINIATURA', 'libros/detectives_salvajes_m2.jpg'),

(21, 'PRINCIPAL', 'libros/señor_anillos.jpg'),
(21, 'MINIATURA', 'libros/señor_anillos_m1.jpg'),
(21, 'MINIATURA', 'libros/señor_anillos_m2.jpg'),

(22, 'PRINCIPAL', 'libros/hobbit.jpg'),

(23, 'PRINCIPAL', 'libros/harry_potter_piedra_filosofal.jpg'),
(23, 'MINIATURA', 'libros/harry_potter_piedra_filosofal_m1.jpg'),
(23, 'MINIATURA', 'libros/harry_potter_piedra_filosofal_m2.jpg'),

(24, 'PRINCIPAL', 'libros/harry_potter_camara_secreta.jpg'),
(24, 'MINIATURA', 'libros/harry_potter_camara_secreta_m1.jpg'),
(24, 'MINIATURA', 'libros/harry_potter_camara_secreta_m2.jpg'),

(25, 'PRINCIPAL', 'libros/juego_tronos.jpg'),
(25, 'MINIATURA', 'libros/juego_tronos_m1.jpg'),
(25, 'MINIATURA', 'libros/juego_tronos_m2.jpg'),
(25, 'MINIATURA', 'libros/juego_tronos_m3.jpg'),

(26, 'PRINCIPAL', 'libros/cronicas_narnia.jpg'),
(26, 'MINIATURA', 'libros/cronicas_narnia_m1.jpg'),
(26, 'MINIATURA', 'libros/cronicas_narnia_m2.jpg'),

(27, 'PRINCIPAL', 'libros/rueda_tiempo.jpg'),

(28, 'PRINCIPAL', 'libros/nombre_del_viento.jpg'),
(28, 'MINIATURA', 'libros/nombre_del_viento_m1.jpg'),
(28, 'MINIATURA', 'libros/nombre_del_viento_m2.jpg'),
(28, 'MINIATURA', 'libros/nombre_del_viento_m3.jpg'),

(29, 'PRINCIPAL', 'libros/historia_interminable.jpg'),
(29, 'MINIATURA', 'libros/historia_interminable_m1.jpg'),
(29, 'MINIATURA', 'libros/historia_interminable_m2.jpg'),

(30, 'PRINCIPAL', 'libros/american_gods.jpg');


-- ========== DATOS DE PAPELERÍA ==========
INSERT INTO imagenes_producto (id_producto, tipo, ruta) VALUES
(31, 'PRINCIPAL', 'papeleria/mochila_escolar_azul.jpg'),
(31, 'MINIATURA', 'papeleria/mochila_escolar_azul_m1.jpg'),
(31, 'MINIATURA', 'papeleria/mochila_escolar_azul_m2.jpg'),
(31, 'MINIATURA', 'papeleria/mochila_escolar_azul_m3.jpg'),
(31, 'MINIATURA', 'papeleria/mochila_escolar_azul_m4.jpg'),

(32, 'PRINCIPAL', 'papeleria/mochila_deportiva_nike.jpg'),
(32, 'MINIATURA', 'papeleria/mochila_deportiva_nike_m1.jpg'),
(32, 'MINIATURA', 'papeleria/mochila_deportiva_nike_m2.jpg'),
(32, 'MINIATURA', 'papeleria/mochila_deportiva_nike_m2.jpg'),

(33, 'PRINCIPAL', 'papeleria/mochila_universitaria_gris.jpg'),
(33, 'MINIATURA', 'papeleria/mochila_universitaria_gris_m1.jpg'),
(33, 'MINIATURA', 'papeleria/mochila_universitaria_gris_m2.jpg'),
(33, 'MINIATURA', 'papeleria/mochila_universitaria_gris_m3.jpg'),
(33, 'MINIATURA', 'papeleria/mochila_universitaria_gris_m4.jpg'),
(33, 'MINIATURA', 'papeleria/mochila_universitaria_gris_m5.jpg'),

(34, 'PRINCIPAL', 'papeleria/mochila_infantil_spiderman.jpg'),
(34, 'MINIATURA', 'papeleria/mochila_infantil_spiderman_m1.jpg'),
(34, 'MINIATURA', 'papeleria/mochila_infantil_spiderman_m2.jpg'),

(35, 'PRINCIPAL', 'papeleria/agenda_ejecutiva_2025.jpg'),
(35, 'MINIATURA', 'papeleria/agenda_ejecutiva_2025_m1.jpg'),
(35, 'MINIATURA', 'papeleria/agenda_ejecutiva_2025_m2.jpg'),
(35, 'MINIATURA', 'papeleria/agenda_ejecutiva_2025_m3.jpg'),

(36, 'PRINCIPAL', 'papeleria/agenda_escolar_2025.jpg'),
(36, 'MINIATURA', 'papeleria/agenda_escolar_2025_m1.jpg'),
(36, 'MINIATURA', 'papeleria/agenda_escolar_2025_m2.jpg'),
(36, 'MINIATURA', 'papeleria/agenda_escolar_2025_m3.jpg'),
(36, 'MINIATURA', 'papeleria/agenda_escolar_2025_m4.jpg'),

(37, 'PRINCIPAL', 'papeleria/agenda_minimalista_2026.jpg'),
(37, 'MINIATURA', 'papeleria/agenda_minimalista_2026_m1.jpg'),
(37, 'MINIATURA', 'papeleria/agenda_minimalista_2026_m2.jpg'),
(37, 'MINIATURA', 'papeleria/agenda_minimalista_2026_m3.jpg'),
(37, 'MINIATURA', 'papeleria/agenda_minimalista_2026_m4.jpg'),

(38, 'PRINCIPAL', 'papeleria/planificador_mensual.jpg'),
(38, 'MINIATURA', 'papeleria/planificador_mensual_m1.jpg'),
(38, 'MINIATURA', 'papeleria/planificador_mensual_m2.jpg'),
(38, 'MINIATURA', 'papeleria/planificador_mensual_m3.jpg'),

(39, 'PRINCIPAL', 'papeleria/cuaderno_a4_cuadriculado.jpg'),
(39, 'MINIATURA', 'papeleria/cuaderno_a4_cuadriculado_m1.jpg'),
(39, 'MINIATURA', 'papeleria/cuaderno_a4_cuadriculado_m2.jpg'),

(40, 'PRINCIPAL', 'papeleria/cuaderno_a5_rayado.jpg'),
(40, 'MINIATURA', 'papeleria/cuaderno_a5_rayado_m1.jpg'),
(40, 'MINIATURA', 'papeleria/cuaderno_a5_rayado_m2.jpg'),
(40, 'MINIATURA', 'papeleria/cuaderno_a5_rayado_m3.jpg'),
(40, 'MINIATURA', 'papeleria/cuaderno_a5_rayado_m4.jpg'),

(41, 'PRINCIPAL', 'papeleria/libreta_espiral_a4.jpg'),
(41, 'MINIATURA', 'papeleria/libreta_espiral_a4_m1.jpg'),
(41, 'MINIATURA', 'papeleria/libreta_espiral_a4_m2.jpg'),
(41, 'MINIATURA', 'papeleria/libreta_espiral_a4_m3.jpg'),
(41, 'MINIATURA', 'papeleria/libreta_espiral_a4_m4.jpg'),

(42, 'PRINCIPAL', 'papeleria/bloc_notas_adhesivas.jpg'),
(42, 'MINIATURA', 'papeleria/bloc_notas_adhesivas_m1.jpg'),
(42, 'MINIATURA', 'papeleria/bloc_notas_adhesivas_m2.jpg'),
(42, 'MINIATURA', 'papeleria/bloc_notas_adhesivas_m3.jpg'),

(43, 'PRINCIPAL', 'papeleria/recambio_hojas_a4.jpg'),
(43, 'MINIATURA', 'papeleria/recambio_hojas_a4_m1.jpg'),
(43, 'MINIATURA', 'papeleria/recambio_hojas_a4_m2.jpg'),

(44, 'PRINCIPAL', 'papeleria/cuaderno_moleskine.jpg'),
(44, 'MINIATURA', 'papeleria/cuaderno_moleskine_m1.jpg'),
(44, 'MINIATURA', 'papeleria/cuaderno_moleskine_m2.jpg'),
(44, 'MINIATURA', 'papeleria/cuaderno_moleskine_m3.jpg'),
(44, 'MINIATURA', 'papeleria/cuaderno_moleskine_m4.jpg'),

(45, 'PRINCIPAL', 'papeleria/tarjetas_felicitacion.jpg'),
(45, 'MINIATURA', 'papeleria/tarjetas_felicitacion_m1.jpg'),
(45, 'MINIATURA', 'papeleria/tarjetas_felicitacion_m2.jpg'),
(45, 'MINIATURA', 'papeleria/tarjetas_felicitacion_m3.jpg'),

(46, 'PRINCIPAL', 'papeleria/papel_regalo_navideño.jpg'),
(46, 'MINIATURA', 'papeleria/papel_regalo_navideño_m1.jpg'),
(46, 'MINIATURA', 'papeleria/papel_regalo_navideño_m2.jpg'),
(46, 'MINIATURA', 'papeleria/papel_regalo_navideño_m3.jpg'),

(47, 'PRINCIPAL', 'papeleria/sobres_colores.jpg'),
(47, 'MINIATURA', 'papeleria/sobres_colores_m1.jpg'),
(47, 'MINIATURA', 'papeleria/sobres_colores_m2.jpg'),
(47, 'MINIATURA', 'papeleria/sobres_colores_m3.jpg'),

(48, 'PRINCIPAL', 'papeleria/etiquetas_adhesivas.jpg'),
(48, 'MINIATURA', 'papeleria/etiquetas_adhesivas_m1.jpg'),
(48, 'MINIATURA', 'papeleria/etiquetas_adhesivas_m2.jpg'),
(48, 'MINIATURA', 'papeleria/etiquetas_adhesivas_m3.jpg'),
(48, 'MINIATURA', 'papeleria/etiquetas_adhesivas_m4.jpg'),

(49, 'PRINCIPAL', 'papeleria/papel_a4_80g.jpg'),
(49, 'MINIATURA', 'papeleria/papel_a4_80g_m1.jpg'),
(49, 'MINIATURA', 'papeleria/papel_a4_80g_m2.jpg'),
(49, 'MINIATURA', 'papeleria/papel_a4_80g_m3.jpg'),
(49, 'MINIATURA', 'papeleria/papel_a4_80g_m4.jpg'),

(50, 'PRINCIPAL', 'papeleria/papel_fotografico.jpg'),
(50, 'MINIATURA', 'papeleria/papel_fotografico_m1.jpg'),
(50, 'MINIATURA', 'papeleria/papel_fotografico_m2.jpg'),
(50, 'MINIATURA', 'papeleria/papel_fotografico_m3.jpg'),
(50, 'MINIATURA', 'papeleria/papel_fotografico_m4.jpg');


INSERT INTO facturas (num_factura, fecha_factura, precio_total, id_pedido) VALUES
('FAC-2024-001', '2024-01-15', 72.48, 1),
('FAC-2024-002', '2024-02-20', 53.50, 2),
('FAC-2024-003', '2024-03-10', 46.20, 3),
('FAC-2024-005', '2024-05-12', 40.40, 5),
('FAC-2024-006', '2024-06-18', 34.00, 6),
('FAC-2024-008', '2024-08-30', 52.90, 8),
('FAC-2024-009', '2024-09-15', 105.00, 9);

UPDATE usuarios
SET password = '$2a$10$rjk61QcvcX6QMw1ApHy3Nerc98E1ac.a3SFiUCdPeOqOtitp0NxoG'
WHERE email = 'sara@ifp.com';
UPDATE usuarios
SET password = '$2a$10$uMbqlGPfQxpF3J8p0uRiYOS427rAkvdmN.7vwdc0BJgOYwZd2aMXC'
WHERE email = 'tomas@ifp.com';
UPDATE usuarios
SET password = '$2a$10$1eJ8IlKZUGX.UI.Of6LZvuzqxuH4kBQRPyVRNeaRJKC20dgNwZniq'
WHERE email = 'eva@ifp.com';
UPDATE usuarios
SET password = '$2a$10$cE3JWkqnFFhjc5i70AIdfOt3n14mT5dJJ.WppnC6O4mywoNW/tVOe'
WHERE email = 'ramon@ifp.com';

ALTER TABLE pedidos
ADD COLUMN metodo_pago VARCHAR(20),
ADD COLUMN estado_pago VARCHAR(20),
ADD COLUMN paypal_id_pedido VARCHAR(100);