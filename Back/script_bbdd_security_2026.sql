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
    avatar varchar(255),
	id_perfil int,
    foreign key (id_perfil) references perfiles(id_perfil)
);

CREATE TABLE codigo_recuperacion (
    id_codigo_recuperacion int auto_increment primary key, 
    email_codigo_recuperacion varchar(100) not null,
    codigo varchar(10) not null,
    expiracion datetime not null,
    creado_en datetime not null,
    usado boolean default false,
	foreign key (email_codigo_recuperacion) references usuarios(email) on delete cascade
);

create table verificacion_cuenta (
    id_verificacion int auto_increment primary key,
    token varchar(255) not null,
    id_usuario int not null,
    expiracion datetime not null,
    creado_en datetime not null,
    foreign key (id_usuario) references usuarios(id_usuario) on delete cascade
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

create table publicaciones (
    id_publicacion int auto_increment primary key,
    id_usuario int not null,
    id_producto int null,
    texto text,
    imagen varchar(250),
    fecha datetime default current_timestamp,
    likes int default 0,
    comentarios int default 0,
    foreign key(id_usuario) references usuarios(id_usuario),
    foreign key(id_producto) references productos(id_producto)
);

create table likes_publicacion (
    id_like int auto_increment primary key,
    id_publicacion int not null,
    id_usuario int not null,
    fecha datetime default current_timestamp,
    unique (id_publicacion, id_usuario), /* evita que un usuario dé like dos veces a la misma publicacion */
	foreign key (id_publicacion) references publicaciones(id_publicacion),
    foreign key (id_usuario) references usuarios(id_usuario)
);

create table comentarios_publicacion (
    id_comentario int auto_increment primary key,
    id_publicacion int not null,
    id_usuario int not null,
    texto text not null,
    fecha datetime default current_timestamp,
    foreign key (id_publicacion) references publicaciones(id_publicacion),
    foreign key (id_usuario) references usuarios(id_usuario)
);


create table seguidores (
    id int auto_increment primary key,
    id_seguidor int not null,
    id_seguido int not null,
    fecha_seguimiento DATETIME DEFAULT CURRENT_TIMESTAMP,
    unique key unica_relacion (id_seguidor, id_seguido),
    foreign key (id_seguidor) references usuarios(id_usuario) on delete cascade,
    foreign key (id_seguido) references usuarios(id_usuario) on delete cascade
);


INSERT INTO perfiles(nombre)
values ('ROLE_ADMON'),('ROLE_CLIENTE'),
('ROLE_TRABAJADOR'),
('ROLE_JEFE');


INSERT INTO usuarios 
(username, password, nombre, apellidos, enabled, fecha_registro, fecha_nacimiento, direccion, email, avatar, id_perfil) VALUES
('tomasesc', '$2a$10$uMbqlGPfQxpF3J8p0uRiYOS427rAkvdmN.7vwdc0BJgOYwZd2aMXC', 'Tomas', 'Escu', 1, '2025-11-05', '1960-11-02', 'Madrid', 'tomas@ifp.com', '/uploads/perfiles/tomas.png', 1),
('mariardu', '$2a$10$G1z9biVEqDJfQsPQeieplO1OEiXgoJvUcT9/XBOgTCuWdiNj0UcaC', 'Maria', 'Radu', 1, '2025-11-05', '1960-11-02', 'Madrid', 'maria@ifp.com', '/uploads/perfiles/maria.png', 2),
('saribaras', '$2a$10$rjk61QcvcX6QMw1ApHy3Nerc98E1ac.a3SFiUCdPeOqOtitp0NxoG', 'Sara', 'Baras', 1, '2024-02-05', '1999-03-16', 'Sevilla', 'sara@ifp.com', '/uploads/perfiles/sara.png', 2),
('palcald', '$2a$10$wgeISe4JqxuQU2S9Q8Ze5uwN4YBBLuoavlwnTEbNItlrDQdBB8h6u', 'Paloma', 'Calderón', 1, '2024-02-05', '1999-03-16', 'Sevilla', 'paloma@ifp.com', '/uploads/perfiles/paloma.png', 2),
('juangarc', '$2a$10$JWVBDtdPuxc3Lp7W4BieDO7js2mvEz6YiSEj9e1e6mGhwRmRmsj4m', 'Juan', 'García', 1, '2018-12-23', '1970-06-21', 'Galicia', 'juan@ifp.com', '/uploads/perfiles/juan.png', 2),
('rauligl', '$2a$10$zDLw08xUEVqxZjKhF2qv2uo7sZDriM4U8x2y4rbWdgoAuT6osKKI.', 'Raúl', 'Iglesias', 1, '2018-12-23', '1970-06-21', 'Galicia', 'raul@ifp.com', '/uploads/perfiles/raul.png', 2),
('paquiRod', '$2a$10$tnK/swSN.pPaSnByMaLyU.sfLCkDsE1mqZ7F93Is.QXl72eNxSgTq', 'Paqui', 'Rodríguez', 1, '2004-05-14', '1989-02-13', 'Cuenca', 'paqui@ifp.com', '/uploads/perfiles/paqui.png', 2),
('elencdr', '$2a$10$xnln2Z.GJ8TLmu6pf3FLyOTXUM9XYy8mTKh/2F4XJAZFM1hu40Kh2', 'Elena', 'Cuadrado', 1, '2004-05-14', '1989-02-13', 'Cuenca', 'elena@ifp.com', '/uploads/perfiles/elena.png', 2),
('carlrub', '$2a$10$LG/oVQoygOcECMEsZ3159us096iIFQl3PrsPg/u3DNPXVpykU85A2', 'Carlos', 'Rubio', 1, '2023-09-29', '2003-10-02', 'Salamanca', 'carlos@ifp.com', '/uploads/perfiles/carlos.png', 2),
('alejlpz', '$2a$10$V2QYmmpdnaHqr7r3D7RJy.7yQjxn7fcWXkHbcauUtR5gnqx1EpFUa', 'Alejandro', 'López', 1, '2023-09-29', '2003-10-02', 'Salamanca', 'alejandro@ifp.com', '/uploads/perfiles/alejandro.png', 2),
('nadiacsl', '$2a$10$S40sJwmdN9Yh9nAbAn4JD.9TBdP53MOJCCthcwlnfxAgbBdZb7nzK', 'Nadia', 'Casel', 1, '2023-09-29', '2003-10-02', 'Cáceres', 'nadia@ifp.com', '/uploads/perfiles/nadia.png', 2),
('rosavlo', '$2a$10$7EcNTYFHJaRhWT45tW3m5esiiLvzt7krj3iZwyn6.7jHUfxhzt2x6', 'Rosa', 'Velo', 1, '2023-09-29', '2003-10-02', 'Cáceres', 'rosa@ifp.com', '/uploads/perfiles/rosa.png', 2),
('joaqpzo', '$2a$10$eo1Tznaq/sP78ia4y/piJ.hXsyDfIVb2Z6YsnpchNW/H0kw.x6ty.', 'Joaquin', 'Pozo', 1, '2023-09-29', '2003-10-02', 'Segovia', 'joaquin@ifp.com', '/uploads/perfiles/joaquin.png', 2),
('pepedbson', '$2a$10$.T43po/EyGWwFnZ92LkbiOF6AKv7Iq84ef/rTDY7rbKQXujsTF2cS', 'Pepe', 'Dobson', 1, '2023-09-29', '2003-10-02', 'Segovia', 'pepe@ifp.com', '/uploads/perfiles/pepe.png', 2),
('sunakim', '$2a$10$6D1fPoIBGmtphX2frS93neMaHhPtAR425X7R6fUL.ODWx2gEgwmli', 'Suna', 'Kim', 1, '2023-09-29', '2003-10-02', 'Valencia', 'suna@ifp.com', '/uploads/perfiles/suna.png', 2),
('evagoma', '$2a$10$1eJ8IlKZUGX.UI.Of6LZvuzqxuH4kBQRPyVRNeaRJKC20dgNwZniq', 'Eva', 'Goma', 1, '2000-01-02', '1978-05-24', 'Cordoba', 'eva@ifp.com', '/uploads/perfiles/eva.png', 3),
('ramgnzl', '$2a$10$cE3JWkqnFFhjc5i70AIdfOt3n14mT5dJJ.WppnC6O4mywoNW/tVOe', 'Ramon', 'González', 1, '2014-07-07', '1996-06-04', 'Madrid','ramon@ifp.com', '/uploads/perfiles/ramon.png', 4);


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
('American Gods','Fantasía contemporánea que mezcla mitología y crítica social.','LIBRO',19.90,35,'AGOTADO','2024-03-30',13.50),

('Underwater','Fantasía contemporánea que mezcla mitología y crítica social.','LIBRO',19.90,35,'DISPONIBLE','2024-03-30',16.10);

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
'Una mezcla de mitología y modernidad que cuestiona la fe, la identidad y el papel de los dioses en un mundo cambiante. La novela explora cómo las creencias evolucionan con el tiempo y cómo las figuras divinas deben adaptarse a una sociedad que ya no las recuerda, mientras fuerzas antiguas y nuevas compiten por sobrevivir.'),

(31,'9780000000041','Debolsillo','2017-10-09','Jack Donoso',624,7,5,
'Jack Donoso es un joven y peculiar periodista que está inciando su carrera profesional en la sección de Espectáculos del diario El Patriota, de Ciudad Cándida. Lleva una vida tranquila hasta que, por azares del destino, debe cubrir la nota de la explosión de un automóvil frente al edificio del Ministerio de Obras Públicas. A partir de ese momento, se ve implicado en una intriga política y policiaca que pone en peligro su vida. Esta emocionante novela recupera las características del género policiaco y les añade elementos fantásticos.');


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
(32,1,1,
'[Ligera y portátil] Mochila escolar para niñas de color liso: 31 x 18 x 45 cm/12,2"x7,1"x17,7" (largo x ancho x alto). Capacidad aproximada: admite un portátil de hasta 15,6 pulgadas. Pesa 750 g, lo que la hace fácil de transportar.
[Gran capacidad y múltiples bolsillos] El bolsillo principal incluye un compartimento para portátil. Incluye un bolsillo para el móvil, un bolsillo con cierre a presión, dos bolsillos frontales con cremallera y un bolsillo trasero con cremallera. También cuenta con dos bolsillos laterales con hebilla ajustable. Espacio suficiente para guardar botellas de agua, paraguas, libros y otros artículos de papelería.
[Materiales de primera calidad] Fabricada en poliéster compuesto de alta densidad y alta calidad, resistente a la deformación. Cremalleras suaves, cinturón elástico trasero compatible con maletas con ruedas, correas de hombro y asa con costuras reforzadas para transportar objetos pesados.
[Diseño ergonómico] Correa en forma de S que protege la espalda y la columna vertebral. Los paneles de malla transpirable favorecen la circulación del aire y absorben el sudor para mayor comodidad en los días calurosos. Asa superior de descompresión suave para un agarre fácil y correas de hombro anchas, ajustables y transpirables que brindan mayor comodidad a esta mochila escolar para niñas y alivian la carga de tu hija.
[Sorpresa para niñas] Diseño simple de color liso con un encantador llavero, con un toque vibrante y juvenil, ideal para adolescentes que van a la escuela, de compras, citas, viajes, camping, conducir, etc. Se puede usar como mochila escolar, mochila de diario o mochila informal.'),
(33,2,1,
'Correas de hombro acolchadas y ajustables
Gran compartimento principal
Tejido duradero
Detalles distintivos de la marca'),
(34,3,1,
'Multifuncional: La bolsa para computadora portátil de 17,3 pulgadas proporciona 1 compartimento grande con 5 bolsillos pequeños para guardar sus pertenencias como iPad, bolígrafos, llaves. El compartimento principal puede contener carpetas de archivos grandes y cuadernos. La funda para computadora portátil separada es lo suficientemente grande para transportar computadoras portátiles de 17, 15.6, 15 pulgadas compatibles para Dell, HP, Asus, Lenovo, Toshiba, Acer, Samsung, Sony, MacBook
Resistente al agua Duradero: Este bolso para hombre está hecho de un material de tela de nailon ligero y de alta calidad. Ofrece una experiencia de textura de gran comodidad y muestra moda y estilo
Práctico y Seguro: La correa para equipaje facilita sujetar el bolso a tu maleta, mientras que su bolsillo antirrobo oculto garantiza la protección de tus pertenencias más valiosas
Protección Superior: Un acolchado de espuma de 0,5 cm de grosor con un cierre de pasador de nailon protege su portátil de arañazos y es a prueba de golpes. Bien puede evitar que su computadora portátil se dañe en cualquier momento
Cómodo y Conveniente: Con un diseño simple y elegante, esta bolsa para computadora portátil con múltiples bolsillos es adecuada para personas de diferentes edades. Como maletín para portátil todo en uno, será el compañero perfecto para hombres, mujeres, profesores y empresarios'),
(35,4,1,
'GARANTÍA Y CALIDAD: SPIDER-MAN Oficial mochila infantil escolar para niños en guardería con 2 años de garantía
DISEÑO ÚNICO: Confeccionada con un material de poliéster muy resistente y cremalleras suaves. Fácil de lavar
ESPACIOSA Y LIGERA: Tiradores en los cursores para facilitar su apertura. Doble tirador en cremallera principal. Costuras reforzadas
ERGONOMÍA Y COMODIDAD: Mochila adaptable a carro Safta (Ultraligero y Ruedas PVC). Asa de mano en la parte superior y tarjeta de identificación personal
RESISTENCIA Y DURABILIDAD: Este producto está especialmente diseñado pensando en su durabilidad, elaborado con materiales de alta resistencia para asegurar que se pueda utilizar en todo tipo de actividades, garantizando su funcionalidad'),

(36,5,2,'Bloc de notas grande con 240 páginas en blanco para notas, bocetos, reflexiones, etc.
Páginas de papel libre de ácido de alta calidad, resiste daños provocados por la luz y el aire.
Tapas encuadernadas de cartón con esquinas redondeadas para un acabado final.
Marcapáginas integrado, cierre elástico que ayuda a mantener el cuaderno cerrado de forma segura.
Bolsillo interior extensible para guardar objetos sueltos, mide 11,6 x 20,4 cm'),
(37,6,2,'PLANIFICACIÓN DIARIA - Organiza tu curso escolar desde septiembre 2025 hasta julio 2026 con una estructura de una página por día (excepto fines de semana), que ofrece un espacio generoso para escribir tareas, apuntes, fechas de entrega y recordatorios, facilitando así el desarrollo de hábitos de organización y mejorando la gestión del tiempo para estudiantes que buscan aprovechar cada jornada al máximo.
DISEÑO MOTIVADOR - Presenta un diseño interior lleno de color y detalles visuales alegres que hacen que el uso diario de la agenda sea divertido y estimulante, además de estar en formato bilingüe Español-Inglés, lo cual permite reforzar el idioma de manera natural; sus pegatinas incluidas permiten personalizar cada página y expresar creatividad mientras se planifica.
MATERIALES RESISTENTES - Confeccionada con materiales de alta calidad, esta agenda cuenta con una tapa semirrígida protegida por cubiertas plásticas, una encuadernación en espiral de plástico reciclable flexible que no se deteriora al doblarse, y papel premium de 80 g/m² que evita el traspaso de tinta, haciéndola perfecta para un uso intensivo durante todo el curso escolar sin perder su forma ni funcionalidad.'),
(38,7,2,'18 MESES: Agenda semanal 2025/2026 que cubre 18 meses, desde julio de 2025 hasta diciembre de 2026 para marcar tus citas y actividades diarias y semanales.
LAYOUT HORIZONTAL: La agenda presenta cada semana en dos páginas a la vista, para tener una visión general de los compromisos semanales de un vistazo.
PLUS: También incluye un calendario, un planificador de viajes, páginas rayadas para notas y una página "En caso de pérdida" impresa en la portada.
DISEÑO: Esta agenda horizontal presenta esquinas redondeadas, cierre con elástico y marcador de página coordinado. El papel es libre de ácido, de 70 g/m² y color marfil.'),
(39,8,2,'ORGANÍZATE FÁCILMENTE — ¡Organiza tu mes de un vistazo con nuestro calendario mensual! Día por día organizado a página por mes. Ideal si buscas agendas escolares de sobremesa, familiares o simplemente necesitas organizar mejor tu mes y que no se te escape nada!
FUNCIONAL Y PERSONALIZABLE — Planificador mensual multifunción consta de múltiples áreas de ayuda para mejorar tu orden mensual: Objetivo del mes / Tareas / Tareas TOP 3 / Número de cada día de la semana y mes. Ideal para cualquier planning mensual.
EXCLUSIVO Y ECOLÓGICO — Planificador de mesa de 25 páginas. Diseño muy cuidado y exclusivo con una impresión de alta calidad. Bloc de notas con base rígida para protegerlo y poder transportarlo sin problemas. Nuestro planner tiene como packaging un sobre de papel, no usamos nada de plástico en nuestros productos. Tamaño A4 y papel de calidad con certificado Ecológico PEFC. Desde PACKLIST estamos comprometidos con nuestro planeta y con el desarrollo sostenible.'),

(40,6,3,'Cuaderno espiral 80 hojas formato folio (31 x 21,5 cm) con tapa blanda plastificada.
Rayado contínuo cuadrícula 4x4 con margen de color azul.
Espiral con cierre de seguridad coil‐lock para no dañar al usuario y evitar que se enganche con otra espiral.
Cantos romos para garantizar un uso ergonómico y seguro y evitar que las tapas se deterioren.
Paquete de 5 libretas con colores de tapa aleatorios: Naranja, Amarillo, Verde, Azul Marino, Rojo.'),
(41,6,3,'Paquete Incluido: Incluidas 6 pcs de 21 x 14cm de cuaderno rayado de notas, 60 hojas/120 páginas, papel de escritura de 80 g/m2 con cubierta de Kraft. El papel está fabricado con materias primas certificadas FSC.
Papel de Calidad: Cuadernos diarios con rayas está hecho de papel de alta calidad, reciclable y ecológico, no es fácil que se dañe y para tener un espesor suficiente, el papel beige también protege los ojos.
Escritura Suave: La excepcional calidad de este papel no solo garantiza una superficie suave para escribir, sino que también previene el traspaso de tinta, proporcionando una escritura limpia y legible en ambas caras de la hoja.
Fácil de usar: La cubierta de papel kraft blanda es resistente y duradera, y la doble hélice negra hace que sea más fácil pasar las páginas 360° sin tartamudear en absoluto.'),
(42,6,3,'Cuaderno A4 con espiral metálica y tapa dura. 80 hojas de papel en blanco.
Papel de 95 gr/m² de alta calidad, microperforado y con 4 taladros. Iniciador de corte para facilitar la separación de cada hoja.
Cubierta de cartón rígido y logotipo MILAN brillante en relieve.
Espiral flexible con cierre de seguridad que evita enganches con la ropa o rayaduras en muebles.
Colección 430 since 1918, inspirada en los colores y diseño originales de las gomas de borrar MILAN, fabricadas en España desde 1918. Color verde.'),
(43,9,3,'76 x 76 mm, 12 Blocs/Paquete, 80 Hojas/Bloc, un total de 960 hojas, Excelente relación calidad-precio.
ZCZN notas adhesivas de 6 brillantes colores pueda satisfacer sus múltiples necesidades de uso.
Papel de alta calidad, escritura suave, fácil de usar y despegar, sin residuos, puede mantenerse limpio y ordenado.
Nuestras notas autoadhesivas tienen una mejor adhesión,que no es tóxico ni tiene sabor, se adsorbirá durante mucho tiempo sin caerse.
Todas nuestras ZCZN notas adhesivas están fabricado con materias primas con certificación FSC.'),
(44,10,3,'Recambio retractilado de 250 hojas sueltas A4 con 4 taladros; compatibles con carpetas de anillas y archivadores palanca; archiva tus apuntes fácilmente y transporta sólo las hojas que necesites.
Cuadrícula 5x5 enmarcado con cabecera para la identificación del tema, poner la fecha, etc; 5 bandas de color pastel ideales para la clasificación por color de las asignaturas.
Papel Optik Paper: un papel de Oxford con opacidad, lisura y satinado óptimas; la tinta no traspasa de un lado a otro ni se dispersa, resistente a la presión del lápiz y al borrado.
Compatible con la aplicación gratuita SCRIBZEE que permite escanear tus notas manuscritas para poder tenerlas en el móvil, tablet u ordenador y compartirlas, organizarlas, o consultarlas cuando y donde quieras.'),
(45,11,3,'El clásico y legendario cuaderno Moleskine se actualiza una vez más con nuevos colores y diseños, pero manteniendo la iconicidad y las características del clásico cuaderno más vendido de la marca.
Diseño clásico con cierre elástico y un cómodo marcapáginas para no perder nunca la página; En la parte posterior hay una solapa plegable para guardar notas y papeles importantes.
El cuaderno tiene 192 páginas lisas y papel marfil de 70 g/m² sin ácido y el icónico aviso "En caso de pérdida" para escribir tu información de contacto en caso de que pierdas tu cuaderno.
En la contraportada del cuaderno aparecen diseños temáticos y la inconfundible historia de Moleskine en el interior de todos nuestros productos, un detalle icónico de la marca; Se puede abrir 180º.'),

(46,12,4,'DISEÑO ESTILIZADO: Elegante diseño en papel kraft. Estos diseños de tarjeta felicitacion boda presentan un precioso ramillete de flores secas, dando al destinatario una sensación de elegancia y sofisticación.
TAMAÑO DE LA CANTIDAD: Recibirá 10 tarjetas de felicitación de flores secas en papel kraft. Cada Tarjeta de Felicitación mide 7x10CM. La cantidad es suficiente para satisfacer la mayoría de sus necesidades.
PAPEL ECOLÓGICO: Nuestras tarjeta felicitacion cumpleaños están hechas de papel kraft grueso de alta calidad con bordes lisos, no es fácil de cortar o rasgar. Estas tarjetas de felicitación no destiñen, son fáciles de escribir y tienen un aspecto elegante.'),
(47,13,4,'Pack de 5 rollos con diseños navideños variados: Incluye 5 estampados diferentes con motivos clásicos como Santa Claus, renos, regalos, estrellas y copos de nieve.
Tamaño grande 70x200cm: Cada rollo ofrece el doble de papel que la mayoría del mercado, ideal incluso para cajas de regalo grandes.
Papel resistente y fácil de usar: Fabricado en papel grueso y duradero que no se rompe fácilmente al doblar o cortar.
Ideal para todas las ocasiones: Perfecto para cumpleaños, fiestas infantiles, baby showers, Navidad o cualquier celebración especial.
Multiusos y creativo: Además de envolver regalos, también sirve para manualidades, scrapbooking y decoración escolar.'),
(48,14,4,'Materiales de Alta Calidad: Estos sobres de colores están hechos de papel de escribir reciclable de alta calidad que no se rompe fácilmente; el grosor de los diferentes sobres de colores puede variar ligeramente pero no afecta al uso, todos son igual de duraderos y no hay que preocuparse por la decoloración.
Perfectos para Cartas: Están en blanco por ambas caras, así que puede usar su imaginación para crear un sobre de bricolaje diferente; los sobres de colores también son perfectos para envolver y enviar tarjetas de agradecimiento, invitaciones, postales, tarjetas de felicitación, cartas, cheques, fotos.
Tamaño de Sobre Adecuado: Todos los sobres de colores miden 17,6*12,6 cm, un tamaño lo suficientemente grande como para guardar varias cosas y, por supuesto, perfecto para enviar cartas dondequiera que se envíen.
Bonitas Pegatinas: Hay dos tamaños de pegatinas, 27 estilos y un total de 81 pegatinas pequeñas, que se pueden utilizar como cierre del sobre o como decoración del mismo, para que puedas personalizar el sobre a tu gusto.'),
(49,15,4,'Superficie mate. Grande para escribir con bolígrafos, lápices y marcadores.
Autoadhesivo. Se adhiere perfectamente al papel, la madera, el plástico y la mayoría de las superficies planas.
Superficie blanca.
Diámetro: 38 x 13 mm.
20 etiquetas por hoja. 25 hojas. 500 etiquetas.'),

(50,16,5,'TAMAÑOS - Disponible en tamaños A5, A4 y A3 para adaptarse a diversas necesidades de impresión, desde documentos estándar hasta proyectos más grandes.
CALIDAD PREMIUM - Nuestros folios de papel premium de 80g/m² garantizan una excelente calidad de impresión, con colores nítidos y texto legible, ideal para presentaciones profesionales, informes y documentos importantes.
DIFERENTES ENVASES - Con los folios de papel premium de Raylu Paper tendrás la posibilidad de elegir entre paquetes más pequeños o cajas más grandes, según la cantidad de folios que necesites.
COMPATIBILIDAD - Nuestros folios de papel son compatibles con impresoras láser, inkjet y fotocopiadoras, por lo que asegurarás una experiencia de impresión sin complicaciones.
SOSTENIBILIDAD - Fabricados con materiales respetuosos con el medio ambiente, nuestros folios de papel premium son una elección ecoamigable para aquellos preocupados por el medio ambiente.'),
(51,17,5,'Acabado de alto brillo: el papel fotográfico Wenrescry ofrece un acabado de alto brillo que muestra sus fotos en colores vivos y reales. El recubrimiento especial garantiza una calidad de impresión óptima y lo hace ideal para impresiones fotográficas de alta resolución.
Resistente al agua y de secado rápido: nuestro papel fotográfico A4 es se seca instantáneamente, lo que lo hace especialmente conveniente para el uso rápido de tarjetas fotográficas e impresiones en entornos domésticos o de oficina. Previene la decoloración y protege tus fotos a largo plazo.
Compatibilidad con todas las impresoras de inyección de tinta: el papel fotográfico Wenrescry es adecuado para todas las impresoras de inyección de tinta comunes, como Canon, HP y Epson, y garantiza constantemente buenos resultados en todos los dispositivos.
Longevidad de las fotografías: Gracias a sus propiedades de larga duración, sus impresiones son especialmente duraderas. Las fotos impresas con este papel conservan su vibrante profundidad de color y no se desvanecen, lo que lo hace perfecto para fotos de vacaciones, fotografías familiares o proyectos escolares.
Aplicaciones versátiles: El papel fotográfico es versátil y es adecuado no solo para fotografías, sino también para hacer folletos, carteles, invitaciones o envolver regalos para enriquecer sus proyectos creativos. Está disponible en un pack de 50 hojas (A4, 200 g/m²).');

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

(30, 'PRINCIPAL', 'libros/american_gods.jpg'),

(31, 'PRINCIPAL', 'libros/underwater.jpg');


-- ========== DATOS DE PAPELERÍA ==========
INSERT INTO imagenes_producto (id_producto, tipo, ruta) VALUES
(32, 'PRINCIPAL', 'papeleria/mochila_escolar_azul.jpg'),
(32, 'MINIATURA', 'papeleria/mochila_escolar_azul_m1.jpg'),
(32, 'MINIATURA', 'papeleria/mochila_escolar_azul_m2.jpg'),
(32, 'MINIATURA', 'papeleria/mochila_escolar_azul_m3.jpg'),
(32, 'MINIATURA', 'papeleria/mochila_escolar_azul_m4.jpg'),

(33, 'PRINCIPAL', 'papeleria/mochila_deportiva_nike.jpg'),
(33, 'MINIATURA', 'papeleria/mochila_deportiva_nike_m1.jpg'),
(33, 'MINIATURA', 'papeleria/mochila_deportiva_nike_m2.jpg'),
(33, 'MINIATURA', 'papeleria/mochila_deportiva_nike_m2.jpg'),

(34, 'PRINCIPAL', 'papeleria/mochila_universitaria_gris.jpg'),
(34, 'MINIATURA', 'papeleria/mochila_universitaria_gris_m1.jpg'),
(34, 'MINIATURA', 'papeleria/mochila_universitaria_gris_m2.jpg'),
(34, 'MINIATURA', 'papeleria/mochila_universitaria_gris_m3.jpg'),
(34, 'MINIATURA', 'papeleria/mochila_universitaria_gris_m4.jpg'),
(34, 'MINIATURA', 'papeleria/mochila_universitaria_gris_m5.jpg'),

(35, 'PRINCIPAL', 'papeleria/mochila_infantil_spiderman.jpg'),
(35, 'MINIATURA', 'papeleria/mochila_infantil_spiderman_m1.jpg'),
(35, 'MINIATURA', 'papeleria/mochila_infantil_spiderman_m2.jpg'),

(36, 'PRINCIPAL', 'papeleria/agenda_ejecutiva_2025.jpg'),
(36, 'MINIATURA', 'papeleria/agenda_ejecutiva_2025_m1.jpg'),
(36, 'MINIATURA', 'papeleria/agenda_ejecutiva_2025_m2.jpg'),
(36, 'MINIATURA', 'papeleria/agenda_ejecutiva_2025_m3.jpg'),

(37, 'PRINCIPAL', 'papeleria/agenda_escolar_2025.jpg'),
(37, 'MINIATURA', 'papeleria/agenda_escolar_2025_m1.jpg'),
(37, 'MINIATURA', 'papeleria/agenda_escolar_2025_m2.jpg'),
(37, 'MINIATURA', 'papeleria/agenda_escolar_2025_m3.jpg'),
(37, 'MINIATURA', 'papeleria/agenda_escolar_2025_m4.jpg'),

(38, 'PRINCIPAL', 'papeleria/agenda_minimalista_2026.jpg'),
(38, 'MINIATURA', 'papeleria/agenda_minimalista_2026_m1.jpg'),
(38, 'MINIATURA', 'papeleria/agenda_minimalista_2026_m2.jpg'),
(38, 'MINIATURA', 'papeleria/agenda_minimalista_2026_m3.jpg'),
(38, 'MINIATURA', 'papeleria/agenda_minimalista_2026_m4.jpg'),

(39, 'PRINCIPAL', 'papeleria/planificador_mensual.jpg'),
(39, 'MINIATURA', 'papeleria/planificador_mensual_m1.jpg'),
(39, 'MINIATURA', 'papeleria/planificador_mensual_m2.jpg'),
(39, 'MINIATURA', 'papeleria/planificador_mensual_m3.jpg'),

(40, 'PRINCIPAL', 'papeleria/cuaderno_a4_cuadriculado.jpg'),
(40, 'MINIATURA', 'papeleria/cuaderno_a4_cuadriculado_m1.jpg'),
(40, 'MINIATURA', 'papeleria/cuaderno_a4_cuadriculado_m2.jpg'),

(41, 'PRINCIPAL', 'papeleria/cuaderno_a5_rayado.jpg'),
(41, 'MINIATURA', 'papeleria/cuaderno_a5_rayado_m1.jpg'),
(41, 'MINIATURA', 'papeleria/cuaderno_a5_rayado_m2.jpg'),
(41, 'MINIATURA', 'papeleria/cuaderno_a5_rayado_m3.jpg'),
(41, 'MINIATURA', 'papeleria/cuaderno_a5_rayado_m4.jpg'),

(42, 'PRINCIPAL', 'papeleria/libreta_espiral_a4.jpg'),
(42, 'MINIATURA', 'papeleria/libreta_espiral_a4_m1.jpg'),
(42, 'MINIATURA', 'papeleria/libreta_espiral_a4_m2.jpg'),
(42, 'MINIATURA', 'papeleria/libreta_espiral_a4_m3.jpg'),
(42, 'MINIATURA', 'papeleria/libreta_espiral_a4_m4.jpg'),

(43, 'PRINCIPAL', 'papeleria/bloc_notas_adhesivas.jpg'),
(43, 'MINIATURA', 'papeleria/bloc_notas_adhesivas_m1.jpg'),
(43, 'MINIATURA', 'papeleria/bloc_notas_adhesivas_m2.jpg'),
(43, 'MINIATURA', 'papeleria/bloc_notas_adhesivas_m3.jpg'),

(44, 'PRINCIPAL', 'papeleria/recambio_hojas_a4.jpg'),
(44, 'MINIATURA', 'papeleria/recambio_hojas_a4_m1.jpg'),
(44, 'MINIATURA', 'papeleria/recambio_hojas_a4_m2.jpg'),

(45, 'PRINCIPAL', 'papeleria/cuaderno_moleskine.jpg'),
(45, 'MINIATURA', 'papeleria/cuaderno_moleskine_m1.jpg'),
(45, 'MINIATURA', 'papeleria/cuaderno_moleskine_m2.jpg'),
(45, 'MINIATURA', 'papeleria/cuaderno_moleskine_m3.jpg'),
(45, 'MINIATURA', 'papeleria/cuaderno_moleskine_m4.jpg'),

(46, 'PRINCIPAL', 'papeleria/tarjetas_felicitacion.jpg'),
(46, 'MINIATURA', 'papeleria/tarjetas_felicitacion_m1.jpg'),
(46, 'MINIATURA', 'papeleria/tarjetas_felicitacion_m2.jpg'),
(46, 'MINIATURA', 'papeleria/tarjetas_felicitacion_m3.jpg'),

(47, 'PRINCIPAL', 'papeleria/papel_regalo_navideño.jpg'),
(47, 'MINIATURA', 'papeleria/papel_regalo_navideño_m1.jpg'),
(47, 'MINIATURA', 'papeleria/papel_regalo_navideño_m2.jpg'),
(47, 'MINIATURA', 'papeleria/papel_regalo_navideño_m3.jpg'),

(48, 'PRINCIPAL', 'papeleria/sobres_colores.jpg'),
(48, 'MINIATURA', 'papeleria/sobres_colores_m1.jpg'),
(48, 'MINIATURA', 'papeleria/sobres_colores_m2.jpg'),
(48, 'MINIATURA', 'papeleria/sobres_colores_m3.jpg'),

(49, 'PRINCIPAL', 'papeleria/etiquetas_adhesivas.jpg'),
(49, 'MINIATURA', 'papeleria/etiquetas_adhesivas_m1.jpg'),
(49, 'MINIATURA', 'papeleria/etiquetas_adhesivas_m2.jpg'),
(49, 'MINIATURA', 'papeleria/etiquetas_adhesivas_m3.jpg'),
(49, 'MINIATURA', 'papeleria/etiquetas_adhesivas_m4.jpg'),

(50, 'PRINCIPAL', 'papeleria/papel_a4_80g.jpg'),
(50, 'MINIATURA', 'papeleria/papel_a4_80g_m1.jpg'),
(50, 'MINIATURA', 'papeleria/papel_a4_80g_m2.jpg'),
(50, 'MINIATURA', 'papeleria/papel_a4_80g_m3.jpg'),
(50, 'MINIATURA', 'papeleria/papel_a4_80g_m4.jpg'),

(51, 'PRINCIPAL', 'papeleria/papel_fotografico.jpg'),
(51, 'MINIATURA', 'papeleria/papel_fotografico_m1.jpg'),
(51, 'MINIATURA', 'papeleria/papel_fotografico_m2.jpg'),
(51, 'MINIATURA', 'papeleria/papel_fotografico_m3.jpg'),
(51, 'MINIATURA', 'papeleria/papel_fotografico_m4.jpg');


INSERT INTO facturas (num_factura, fecha_factura, precio_total, id_pedido) VALUES
('FAC-2024-001', '2024-01-15', 72.48, 1),
('FAC-2024-002', '2024-02-20', 53.50, 2),
('FAC-2024-003', '2024-03-10', 46.20, 3),
('FAC-2024-005', '2024-05-12', 40.40, 5),
('FAC-2024-006', '2024-06-18', 34.00, 6),
('FAC-2024-008', '2024-08-30', 52.90, 8),
('FAC-2024-009', '2024-09-15', 105.00, 9);


INSERT INTO publicaciones (id_usuario, texto, imagen, fecha, likes, comentarios) VALUES
(4, 'Hoy he vuelto a una librería pequeña del centro. No iba con intención de comprar nada, pero ya sabéis cómo acaba eso…', NULL, NOW() - INTERVAL 1 DAY, 3, 1),
(7, 'Me encanta cuando un libro te sorprende justo cuando pensabas que ya lo habías entendido todo. Esa sensación no tiene precio.', NULL, NOW() - INTERVAL 2 DAY, 5, 2),
(2, 'Estoy intentando leer un poco cada mañana antes de empezar el día. Me ayuda a no ir con prisas y a empezar con buena energía.', NULL, NOW() - INTERVAL 3 DAY, 2, 0),
(2, 'Hoy he encontrado una frase preciosa: “A veces, lo que buscas llega cuando dejas de buscarlo”. La he tenido que subrayar.', NULL, NOW() - INTERVAL 4 DAY, 4, 1),
(3, 'He empezado un cuaderno nuevo para escribir ideas. No sé si saldrá algo bueno, pero me hace ilusión tener un espacio solo para mí.', NULL, NOW() - INTERVAL 5 DAY, 1, 0),
(5, '¿Alguna recomendación de libros de misterio? Me apetece algo que me enganche desde la primera página.', NULL, NOW() - INTERVAL 6 DAY, 6, 3),
(2, 'Hoy he tenido una tarde tranquila con café y lectura. Ojalá más días así.', NULL, NOW() - INTERVAL 7 DAY, 2, 0),
(7, 'Estoy releyendo un libro que me marcó hace años. Qué curioso cómo cambia la perspectiva con el tiempo.', NULL, NOW() - INTERVAL 8 DAY, 3, 1),
(4, 'A veces solo necesito desconectar un rato y perderme entre páginas. Es mi forma favorita de respirar.', NULL, NOW() - INTERVAL 9 DAY, 4, 2),
(2, 'Hoy me he dado cuenta de que subrayo demasiado, pero no pienso parar. Cada frase bonita merece ser guardada.', NULL, NOW() - INTERVAL 10 DAY, 1, 0),
(3, 'Creo que voy a empezar a escribir reseñas cortas de los libros que leo. No sé si a alguien le servirán, pero a mí me ayudará a recordarlos.', NULL, NOW() - INTERVAL 11 DAY, 2, 0),
(6, 'Me encanta cuando un libro te hace sentir acompañada, incluso en los días más raros.', NULL, NOW() - INTERVAL 12 DAY, 5, 3);


ALTER TABLE pedidos
ADD COLUMN metodo_pago VARCHAR(20),
ADD COLUMN estado_pago VARCHAR(20),
ADD COLUMN paypal_id_pedido VARCHAR(100);