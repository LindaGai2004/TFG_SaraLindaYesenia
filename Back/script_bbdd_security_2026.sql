create database tfg_2026;
use tfg_2026;
create table perfiles
( id_perfil int not null auto_increment primary key,
nombre varchar(250) not null
);

create table usuarios
(
id_usuario int auto_increment primary key,
username varchar(45) not null,
password varchar(250) not null,
nombre varchar(100),
apellidos varchar(200),
enabled int,
FECHA_REGISTRO date,
    fecha_nacimiento date,
    direccion varchar(200),
    email varchar(45) not null unique,
id_perfil int,
    foreign key (id_perfil) references perfiles(id_perfil)
);

create table pedidos
(
id_pedido int auto_increment primary key,
    fecha_venta date not null,
    estado ENUM ('REALIZADO', 'CANCELADO', 'DEVUELTO'),
    total DECIMAL(12,2) NOT NULL,
    id_usuario int,
    foreign key (id_usuario) references usuarios(id_usuario)
);

CREATE TABLE genero (

id_libro int auto_increment primary key not null,
    genero_libro varchar(100) not null
   
);

CREATE TABLE categoria(
id_papeleria int auto_increment primary key not null,
categoria_papeleria varchar(100) not null
);


CREATE TABLE productos (
    id_producto int not null auto_increment primary key,
    nombre_producto varchar(100) not null,
    descripcion varchar(500),
    tipo_producto ENUM ('LIBRO', 'PAPELERIA') not null,
    precio DECIMAL(10,2) not null,
    stock int not null,
    estado ENUM('DISPONIBLE', 'AGOTADO') not null,
    fecha_alta date not null,
    costo_real double not null

);
CREATE TABLE idioma(
id_idioma int auto_increment primary key not null,
idioma_libro varchar(50) not null
);
create table libros(
id_producto int not null primary key,
ISBN VARCHAR(13) not null,
editorial varchar(50),
fecha_publicacion date not null,
autor varchar(100) not null,
numero_paginas int not null,
id_libro int,
    id_idioma int,
    foreign key (id_libro) references genero (id_libro),  
    foreign key (id_producto) references productos(id_producto),
    foreign key (id_idioma) references idioma(id_idioma)
);
CREATE TABLE marca(
<<<<<<< HEAD
id_marca int auto_increment not null primary key,
=======
	id_marca int auto_increment not null primary key,
>>>>>>> 94f8a795e1bf13203bc07e11953d1327fb2d1a1f
    marca_papeleria varchar(100) not null
);
CREATE TABLE papeleria (
id_producto int primary key not null,
id_marca int ,
    id_papeleria int,
    foreign key (id_papeleria) references categoria(id_papeleria),
    foreign key (id_producto) references productos(id_producto),
    foreign key (id_marca) references marca(id_marca)
);

create table detalle_pedido
(
id_detalle_pedido int primary key auto_increment not null,
id_pedido int not null,
    id_producto int not null,
    cantidad int not null,
    precio_unidad dec(12,2) not null,
    foreign key (id_pedido) references pedidos(id_pedido),
    foreign key (id_producto) references productos(id_producto),
    unique (id_pedido, id_producto)
);

create table facturas
(
id_factura int auto_increment primary key,
    num_factura varchar(15) not null,
    fecha_factura date not null,
    precio_total dec(15,2) not null,
    id_pedido int,
    foreign key (id_pedido) references pedidos( id_pedido)
);



insert into perfiles(nombre)
values ('ROLE_ADMON'),('ROLE_CLIENTE'),
('ROLE_TRABAJADOR'),
('ROLE_JEFE');


insert into usuarios (username, password, nombre, apellidos, enabled, fecha_registro, fecha_nacimiento,direccion, email, id_perfil)values
('tomas', '{noop}tomasin', 'Tomas', 'Escu',1,'2025-11-05','1960-11-02','madrid', 'tomas@ifp.com',1),
('sarita', '{noop}sarita', 'Sara', 'Baras',2,'2024-02-05','1999-03-16','sevilla', 'sara@ifp.com',2),
('eva', '{noop}evita', 'Eva', 'Goma',1,'2000-01-02','1978-05-24','cordoba', 'eva@ifp.com',3),
('ramon', '{noop}ramoncin', 'Ramon', 'González',1,'2014-07-07','1996-06-04','madrid','ramon@ifp.com', 4);



INSERT INTO pedidos (fecha_venta, estado, total, id_usuario) VALUES
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

INSERT INTO genero (genero_libro)VALUES
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


INSERT INTO categoria (categoria_papeleria)VALUES
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
('Romance'),
('Estuches'),
('Escritura escolar');


INSERT INTO idioma (idioma_libro) VALUES
('español');
-- ============================================
-- PARTE 1: 100 PRODUCTOS (50 libros + 50 papelería)
-- ============================================

-- ========== 50 LIBROS ==========
INSERT INTO productos
(nombre_producto, descripcion, tipo_producto, precio, stock, estado, fecha_alta, costo_real) VALUES
('La arquitectura de la felicidad','Ensayo sobre arquitectura y bienestar','LIBRO',18.90,40,'DISPONIBLE','2024-01-01',12.50),
('Veinte poemas de amor y una canción desesperada','Libro de poesía de Pablo Neruda','LIBRO',14.50,35,'DISPONIBLE','2024-01-02',9.50),
('Cien años de soledad','Novela del realismo mágico','LIBRO',22.90,50,'DISPONIBLE','2024-01-03',15.00),
('La vida es sueño','Obra clásica del teatro español','LIBRO',12.50,30,'DISPONIBLE','2024-01-04',8.00),
('1984','Novela distópica de ciencia ficción','LIBRO',16.90,45,'DISPONIBLE','2024-01-05',11.00),
('Harry Potter y la piedra filosofal','Novela de fantasía juvenil','LIBRO',19.90,60,'DISPONIBLE','2024-01-06',13.00),
('Los pilares de la Tierra','Novela histórica medieval','LIBRO',25.90,40,'DISPONIBLE','2024-01-07',18.00),
('El principito','Libro infantil clásico','LIBRO',10.90,80,'DISPONIBLE','2024-01-08',6.50),
('Los juegos del hambre','Novela juvenil distópica','LIBRO',17.50,55,'DISPONIBLE','2024-01-09',12.00),
('Diez negritos','Novela de misterio policiaco','LIBRO',14.90,45,'DISPONIBLE','2024-01-10',9.80),
('Orgullo y prejuicio','Novela romántica clásica','LIBRO',15.90,35,'DISPONIBLE','2024-01-11',10.50),
('Los tres mosqueteros','Novela de aventuras','LIBRO',18.50,30,'DISPONIBLE','2024-01-12',12.00),
('Biblia Reina-Valera','Texto sagrado del cristianismo','LIBRO',29.90,25,'AGOTADO','2024-01-13',20.00),
('Don Quijote de la Mancha','Clásico de la literatura española','LIBRO',26.90,20,'DISPONIBLE','2024-01-14',18.50),
('El perfume','Novela de terror psicológico','LIBRO',16.50,40,'DISPONIBLE','2024-01-15',11.20),
('Guía Lonely Planet España','Guía turística actualizada','LIBRO',27.90,30,'DISPONIBLE','2024-01-16',19.00),
('Historia del arte','Manual ilustrado de arte','LIBRO',34.90,25,'DISPONIBLE','2024-01-17',24.00),
('Teoría musical básica','Introducción al lenguaje musical','LIBRO',21.90,30,'DISPONIBLE','2024-01-18',15.00),
('Didáctica moderna','Manual sobre educación actual','LIBRO',23.50,28,'DISPONIBLE','2024-01-19',16.00),
('Cocina mediterránea','Recetario de cocina tradicional','LIBRO',19.50,45,'DISPONIBLE','2024-01-20',13.00),
('Introducción a la programación','Fundamentos de informática','LIBRO',28.90,35,'DISPONIBLE','2024-01-21',20.00),
('Watchmen','Novela gráfica de superhéroes','LIBRO',24.90,30,'DISPONIBLE','2024-01-22',17.00),
('Naruto Volumen 1','Manga shōnen japonés','LIBRO',9.90,70,'DISPONIBLE','2024-01-23',6.50),
('La casa de los espíritus','Novela latinoamericana','LIBRO',18.90,40,'DISPONIBLE','2024-01-24',12.50),
('El túnel','Novela psicológica argentina','LIBRO',13.90,30,'DISPONIBLE','2024-01-25',9.00),
('Crimen y castigo','Clásico de la literatura rusa','LIBRO',21.90,25,'DISPONIBLE','2024-01-26',15.00),
('Pedro Páramo','Novela breve mexicana','LIBRO',12.90,35,'DISPONIBLE','2024-01-27',8.50),
('Como agua para chocolate','Novela romántica','LIBRO',15.50,40,'DISPONIBLE','2024-01-28',10.50),
('Fahrenheit 451','Ciencia ficción distópica','LIBRO',16.90,45,'DISPONIBLE','2024-01-29',11.00),
('Fundación','Saga clásica de ciencia ficción','LIBRO',17.90,40,'DISPONIBLE','2024-01-30',12.00),
('Dune','Épica de ciencia ficción','LIBRO',22.90,35,'DISPONIBLE','2024-01-31',16.00),
('El señor de los anillos','Fantasía épica','LIBRO',39.90,20,'AGOTADO','2024-02-01',28.00),
('El hobbit','Fantasía clásica','LIBRO',18.50,45,'DISPONIBLE','2024-02-02',12.50),
('Los miserables','Clásico de la literatura francesa','LIBRO',29.90,18,'AGOTADO','2024-02-03',21.00),
('Guerra y paz','Novela histórica rusa','LIBRO',34.90,15,'AGOTADO','2024-02-04',25.00),
('El nombre de la rosa','Misterio histórico','LIBRO',19.90,35,'DISPONIBLE','2024-02-05',13.50),
('Ivanhoe','Novela de aventuras histórica','LIBRO',16.50,25,'DISPONIBLE','2024-02-06',11.00),
('Charlie y la fábrica de chocolate','Libro infantil','LIBRO',11.90,50,'DISPONIBLE','2024-02-07',7.50),
('Matilda','Novela infantil','LIBRO',12.50,45,'DISPONIBLE','2024-02-08',8.00),
('Bajo la misma estrella','Novela juvenil romántica','LIBRO',16.90,40,'DISPONIBLE','2024-02-09',11.50),
('Crepúsculo','Romance juvenil fantástico','LIBRO',17.90,35,'DISPONIBLE','2024-02-10',12.00),
('La chica del tren','Thriller psicológico','LIBRO',18.90,30,'DISPONIBLE','2024-02-11',13.00),
('El silencio de los corderos','Thriller y terror','LIBRO',19.50,25,'DISPONIBLE','2024-02-12',14.00),
('Jane Eyre','Novela romántica clásica','LIBRO',15.90,30,'DISPONIBLE','2024-02-13',10.50),
('Cumbres borrascosas','Novela romántica gótica','LIBRO',16.90,28,'DISPONIBLE','2024-02-14',11.50),
('Lo que el viento se llevó','Novela romántica histórica','LIBRO',24.90,20,'DISPONIBLE','2024-02-15',17.50),
('Estudio en escarlata','Novela policiaca','LIBRO',13.90,35,'DISPONIBLE','2024-02-16',9.00),
('El código Da Vinci','Thriller contemporáneo','LIBRO',21.90,30,'DISPONIBLE','2024-02-17',15.50),
('Las crónicas de Narnia','Saga de fantasía','LIBRO',29.90,25,'DISPONIBLE','2024-02-18',21.00),
('El alquimista','Novela de Paulo Coelho sobre sueños y destino','LIBRO',18.90,40,'DISPONIBLE','2024-02-19',12.50);

-- ========== 50 PAPELERÍA ==========
INSERT INTO productos (nombre_producto, descripcion, tipo_producto, precio, stock, estado, fecha_alta, costo_real) VALUES
('Mochila escolar azul', 'Mochila resistente con múltiples compartimentos', 'PAPELERIA', 35.90, 50, 'DISPONIBLE', '2024-03-10', 25.00),
('Mochila deportiva Nike', 'Mochila deportiva de alta calidad', 'PAPELERIA', 45.00, 30, 'DISPONIBLE', '2024-03-11', 32.00),
('Mochila universitaria gris', 'Mochila con compartimento para portátil', 'PAPELERIA', 42.50, 40, 'DISPONIBLE', '2024-03-12', 30.00),
('Mochila infantil Spiderman', 'Mochila con diseño de superhéroe', 'PAPELERIA', 28.90, 35, 'DISPONIBLE', '2024-03-13', 20.00),

('Agenda ejecutiva 2025', 'Agenda día por página de cuero', 'PAPELERIA', 18.90, 60, 'DISPONIBLE', '2024-03-14', 13.50),
('Agenda escolar 2025', 'Agenda semanal para estudiantes', 'PAPELERIA', 12.50, 80, 'DISPONIBLE', '2024-03-15', 9.00),
('Agenda minimalista 2025', 'Agenda con diseño simple y elegante', 'PAPELERIA', 15.90, 55, 'DISPONIBLE', '2024-03-16', 11.00),
('Planificador mensual 2025', 'Planificador con vista mensual', 'PAPELERIA', 14.50, 45, 'DISPONIBLE', '2024-03-17', 10.00),

('Cuaderno A4 cuadriculado', 'Cuaderno 100 hojas de calidad', 'PAPELERIA', 3.50, 150, 'DISPONIBLE', '2024-03-18', 2.50),
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
(id_producto, ISBN, editorial, fecha_publicacion, autor, numero_paginas, id_libro, id_idioma) VALUES
(1,'9788437604947','Cátedra','1605-01-16','Miguel de Cervantes',1216,14,1),
(2,'9788439722222','Sudamericana','1967-05-30','Gabriel García Márquez',471,3,1),
(3,'9788408172173','Planeta','2001-04-12','Carlos Ruiz Zafón',576,10,1),
(4,'9788439721116','Debolsillo','1985-09-01','Gabriel García Márquez',368,11,1),
(5,'9788420423459','Alianza','1866-01-01','Fiódor Dostoyevski',671,14,1),
(6,'9788439722223','RBA','1963-06-28','Julio Cortázar',736,3,1),
(7,'9788401029876','Plaza & Janés','1982-01-01','Isabel Allende',448,3,1),
(8,'9788408144444','Plaza & Janés','1989-10-01','Ken Follett',1076,7,1),
(9,'9788439723333','Seix Barral','1948-01-01','Ernesto Sabato',160,3,1),
(10,'9788432223334','Seix Barral','1963-01-01','Mario Vargas Llosa',480,3,1),

(11,'9788439724445','FCE','1955-03-19','Juan Rulfo',124,3,1),
(12,'9788439725556','Debolsillo','1989-01-01','Laura Esquivel',256,11,1),
(13,'9788408172174','Planeta','2008-04-17','Carlos Ruiz Zafón',672,10,1),
(14,'9788439722224','Sudamericana','1981-01-01','Gabriel García Márquez',144,3,1),
(15,'9788439726667','Seix Barral','1985-01-01','Patrick Süskind',320,15,1),

(16,'9788420429999','Debolsillo','1949-06-08','George Orwell',352,5,1),
(17,'9788439727778','Debolsillo','1932-01-01','Aldous Huxley',288,5,1),
(18,'9788439728889','Minotauro','1953-10-19','Ray Bradbury',256,5,1),
(19,'9788439729990','Debolsillo','1951-06-01','Isaac Asimov',296,5,1),
(20,'9788439730001','Debolsillo','1965-08-01','Frank Herbert',688,5,1),

(21,'9788439731112','Minotauro','1954-07-29','J.R.R. Tolkien',1216,6,1),
(22,'9788401333444','Salamandra','1997-06-26','J.K. Rowling',256,6,1),
(23,'9788439732223','Destino','1950-10-16','C.S. Lewis',816,6,1),
(24,'9788439733334','Minotauro','1937-09-21','J.R.R. Tolkien',310,6,1),
(25,'9788439734445','RBA','2003-08-26','Christopher Paolini',544,6,1),

(26,'9788439735556','Alianza','1862-01-01','Victor Hugo',1488,14,1),
(27,'9788439736667','Alianza','1869-01-01','León Tolstói',1225,14,1),
(28,'9788439737778','Debolsillo','1980-01-01','Umberto Eco',592,10,1),
(29,'9788439738889','Anaya','1844-01-01','Alexandre Dumas',704,12,1),
(30,'9788439739990','Anaya','1819-01-01','Walter Scott',624,12,1),

(31,'9788439740001','Salamandra','1943-04-06','Antoine de Saint-Exupéry',96,8,1),
(32,'9788439740002','Alfaguara','1988-10-01','Roald Dahl',248,8,1),
(33,'9788439740003','Alfaguara','1964-01-01','Roald Dahl',192,8,1),
(34,'9788439740004','Kalandraka','1963-01-01','Maurice Sendak',48,8,1),
(35,'9788439740005','Bruño','1999-01-01','Julia Donaldson',32,8,1),

(36,'9788439740006','Nube de Tinta','2012-01-10','John Green',304,9,1),
(37,'9788439740007','RBA','2008-09-14','Suzanne Collins',384,9,1),
(38,'9788439740008','RBA','2011-04-25','Veronica Roth',432,9,1),
(39,'9788439740009','Debolsillo','2005-10-05','Stephenie Meyer',512,11,1),
(40,'9788439740010','Salamandra','2005-06-28','Rick Riordan',416,9,1),

(41,'9788439740011','Planeta','1934-01-01','Agatha Christie',256,10,1),
(42,'9788439740012','Planeta','2003-03-18','Dan Brown',688,10,1),
(43,'9788439740013','Anaya','1887-11-01','Arthur Conan Doyle',188,10,1),
(44,'9788439740014','Planeta','2013-06-03','Paula Hawkins',496,10,1),
(45,'9788439740015','Planeta','1988-01-01','Thomas Harris',368,15,1),

(46,'9788439740016','Alianza','1813-01-28','Jane Austen',432,11,1),
(47,'9788439740017','Alianza','1847-10-16','Charlotte Brontë',624,11,1),
(48,'9788439740018','Alianza','1847-12-01','Emily Brontë',416,11,1),
(49,'9788439740019','Alianza','1811-01-01','Jane Austen',384,11,1),
(50,'9780061122415','Editorial Planeta','1988-01-01','Paulo Coelho',208,3,1);

INSERT INTO marca (marca_papeleria) VALUES
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
INSERT INTO papeleria (id_producto, id_marca, id_papeleria) VALUES
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
(96,40,12),
(97,41,12),
(98,25,12),

-- Escritura escolar
(99,42,13),
(100,43,13);


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
