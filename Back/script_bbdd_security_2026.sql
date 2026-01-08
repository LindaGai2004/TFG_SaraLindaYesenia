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
    id_usuario int,
    foreign key (id_usuario) references usuarios(id_usuario)
);

CREATE TABLE categoria_libro (
	id_categoria_libro int primary key not null auto_increment,
    genero_libro varchar(100) not null 
);

CREATE TABLE categoria_papeleria (
	id_categoria_papeleria int primary key not null auto_increment,
    nombre varchar(100) not null 
);

CREATE TABLE productos (
    id_producto int not null auto_increment primary key,
    nombre_libro varchar(100) not null,
    descripcion varchar(500),
    tipo_producto ENUM ('LIBRO', 'PAPELERIA'),
    precio double not null,
    stock int not null,
    estado varchar(20) not null,
    fecha_alta date not null,
    costo_real double not null,
    id_categoria_papeleria int ,
    id_categoria_libro int,
	foreign key (id_categoria_papeleria) references categoria_papeleria(id_categoria_papeleria),
	foreign key (id_categoria_libro) references categoria_libro(id_categoria_libro)

);

create table detalle_libro(
	id_detalle_libro int auto_increment not null primary key,
	ISBN long not null,
    idioma varchar(30) not null,
    editorial varchar(50),
    fecha_publicacion date not null,
	autor varchar(100) not null,
    numero_paginas int not null,
    id_producto int not null,
    
    foreign key (id_producto) references productos(id_producto)
);

create table detalle_pedido
(
	id_detalle_libro int primary key auto_increment not null,
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
('tomasss', '{noop}tomasin', 'Tomas', 'Escu',1,'2025-11-05','1960-11-02','madrid', 'tomas@ifp.com',1),
('sarita', '{noop}sarita', 'Sara', 'Baras',2,'2024-02-05','1999-03-16','sevilla', 'sara@ifp.com',2),
('evall', '{noop}evita', 'Eva', 'Goma',1,'2000-01-02','1978-05-24','cordoba', 'eva@ifp.com',3),
('ramonnn', '{noop}ramoncin', 'Ramon', 'González',1,'2014-07-07','1996-06-04','madrid','ramon@ifp.com', 4),
('evall', '{noop}evita', 'Eva', 'Goma',1,'2000-01-02','1978-05-24','cordoba', 'eva22@ifp.com',3);



INSERT INTO pedidos (fecha_venta, estado, id_usuario) VALUES
('2024-01-15', 'REALIZADO', 1),
('2024-02-20', 'REALIZADO', 2),
('2024-03-10', 'REALIZADO', 3),
('2024-04-05', 'CANCELADO', 4),
('2024-05-12', 'REALIZADO', 1),
('2024-06-18', 'REALIZADO', 2),
('2024-07-22', 'DEVUELTO', 3),
('2024-08-30', 'REALIZADO', 4),
('2024-09-15', 'REALIZADO', 1),
('2024-12-10', 'CANCELADO', 2);


INSERT INTO categoria_libro (genero_libro)VALUES
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


INSERT INTO categoria_papeleria (nombre)VALUES
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


-- ============================================
-- PARTE 1: 100 PRODUCTOS (50 libros + 50 papelería)
-- ============================================

-- ========== 50 LIBROS ==========
INSERT INTO productos (nombre_libro, descripcion, tipo_producto, precio, stock, estado, fecha_alta, costo_real, id_categoria_libro, id_categoria_papeleria) VALUES 
('Don Quijote de la Mancha', 'Obra maestra de la literatura española', 'libro', 25.50, 15, 'disponible', '2024-01-15', 18.00, 3, NULL),
('Cien años de soledad', 'Obra cumbre del realismo mágico', 'libro', 22.00, 18, 'disponible', '2024-01-16', 16.00, 3, NULL),
('La sombra del viento', 'Misterio en la Barcelona de posguerra', 'libro', 19.90, 25, 'disponible', '2024-01-17', 14.50, 3, NULL),
('El amor en los tiempos del cólera', 'Historia de amor de cincuenta años', 'libro', 20.50, 12, 'disponible', '2024-01-18', 15.00, 3, NULL),
('Crimen y castigo', 'Novela psicológica sobre culpa y redención', 'libro', 24.00, 10, 'disponible', '2024-01-19', 17.50, 3, NULL),
('Rayuela', 'Novela experimental de lectura múltiple', 'libro', 21.90, 8, 'disponible', '2024-01-20', 16.00, 3, NULL),
('La casa de los espíritus', 'Saga familiar en Chile', 'libro', 23.50, 14, 'disponible', '2024-01-21', 17.00, 3, NULL),
('Los pilares de la tierra', 'Épica medieval sobre una catedral', 'libro', 26.90, 20, 'disponible', '2024-01-22', 19.50, 3, NULL),
('El túnel', 'Novela psicológica sobre obsesión', 'libro', 15.90, 22, 'disponible', '2024-01-23', 11.50, 3, NULL),
('La ciudad y los perros', 'Vida en un colegio militar', 'libro', 19.50, 11, 'disponible', '2024-01-24', 14.00, 3, NULL),
('Pedro Páramo', 'Realismo mágico y fantasmas', 'libro', 14.90, 19, 'disponible', '2024-01-26', 10.50, 3, NULL),
('Como agua para chocolate', 'Romance y recetas en la Revolución', 'libro', 18.50, 24, 'disponible', '2024-01-27', 13.50, 3, NULL),
('El juego del ángel', 'Segunda parte del Cementerio de Libros', 'libro', 22.50, 17, 'disponible', '2024-01-29', 16.50, 3, NULL),
('Crónica de una muerte anunciada', 'Reconstrucción de un crimen de honor', 'libro', 17.50, 21, 'disponible', '2024-01-30', 12.50, 3, NULL),
('El perfume', 'Historia de un asesino con olfato extraordinario', 'libro', 20.90, 15, 'disponible', '2024-02-01', 15.00, 3, NULL),
('1984', 'Novela distópica sobre un futuro totalitario', 'libro', 18.90, 20, 'disponible', '2024-02-02', 13.50, 5, NULL),
('Un mundo feliz', 'Distopía sobre una sociedad perfecta', 'libro', 17.90, 16, 'disponible', '2024-02-03', 13.00, 5, NULL),
('Fahrenheit 451', 'Sociedad que prohíbe los libros', 'libro', 16.50, 18, 'disponible', '2024-02-04', 12.00, 5, NULL),
('Fundación', 'Saga épica de ciencia ficción', 'libro', 21.90, 12, 'disponible', '2024-02-05', 16.00, 5, NULL),
('Dune', 'Épica espacial en un planeta desértico', 'libro', 24.90, 14, 'disponible', '2024-02-06', 18.50, 5, NULL),
('El señor de los anillos', 'Épica fantasía sobre el Anillo Único', 'libro', 35.00, 25, 'disponible', '2024-02-07', 25.00, 6, NULL),
('Harry Potter y la piedra filosofal', 'Primera aventura del mago joven', 'libro', 19.90, 30, 'disponible', '2024-02-08', 14.50, 6, NULL),
('Crónicas de Narnia', 'Aventuras mágicas en un mundo paralelo', 'libro', 28.50, 20, 'disponible', '2024-02-09', 20.00, 6, NULL),
('El hobbit', 'Precuela de El Señor de los Anillos', 'libro', 18.90, 22, 'disponible', '2024-02-10', 14.00, 6, NULL),
('Eragon', 'Joven descubre un huevo de dragón', 'libro', 20.50, 15, 'disponible', '2024-02-11', 15.00, 6, NULL),
('Los miserables', 'Épica sobre justicia y redención', 'libro', 32.00, 8, 'disponible', '2024-02-12', 23.00, 7, NULL),
('Guerra y paz', 'Épica sobre las guerras napoleónicas', 'libro', 38.50, 6, 'disponible', '2024-02-13', 28.00, 7, NULL),
('El nombre de la rosa', 'Misterio medieval en una abadía', 'libro', 24.90, 12, 'disponible', '2024-02-14', 18.00, 7, NULL),
('Los tres mosqueteros', 'Aventuras en la Francia del siglo XVII', 'libro', 22.90, 16, 'disponible', '2024-02-15', 16.50, 7, NULL),
('Ivanhoe', 'Caballeros y torneos medievales', 'libro', 19.90, 10, 'disponible', '2024-02-16', 14.50, 7, NULL),
('El principito', 'Fábula poética sobre la vida', 'libro', 12.90, 40, 'disponible', '2024-02-17', 9.00, 8, NULL),
('Matilda', 'Niña con poderes telequinéticos', 'libro', 14.50, 35, 'disponible', '2024-02-18', 10.50, 8, NULL),
('Charlie y la fábrica de chocolate', 'Aventura en una fábrica mágica', 'libro', 13.90, 38, 'disponible', '2024-02-19', 10.00, 8, NULL),
('Donde viven los monstruos', 'Viaje fantástico de un niño', 'libro', 15.50, 25, 'disponible', '2024-02-20', 11.00, 8, NULL),
('El grúfalo', 'Cuento sobre un ratón astuto', 'libro', 11.90, 30, 'disponible', '2024-02-21', 8.50, 8, NULL),
('Bajo la misma estrella', 'Romance juvenil sobre dos adolescentes', 'libro', 16.90, 28, 'disponible', '2024-02-22', 12.50, 9, NULL),
('Los juegos del hambre', 'Distopía con supervivencia extrema', 'libro', 18.90, 26, 'disponible', '2024-02-23', 14.00, 9, NULL),
('Divergente', 'Sociedad dividida en facciones', 'libro', 17.50, 24, 'disponible', '2024-02-24', 13.00, 9, NULL),
('Crepúsculo', 'Romance entre humana y vampiro', 'libro', 19.90, 20, 'disponible', '2024-02-25', 14.50, 9, NULL),
('Percy Jackson y el ladrón del rayo', 'Mitología griega moderna', 'libro', 16.50, 22, 'disponible', '2024-02-26', 12.00, 9, NULL),
('Asesinato en el Orient Express', 'Misterio en un tren de lujo', 'libro', 17.90, 18, 'disponible', '2024-02-27', 13.00, 10, NULL),
('El código Da Vinci', 'Thriller sobre secretos religiosos', 'libro', 21.50, 20, 'disponible', '2024-02-28', 15.50, 10, NULL),
('Sherlock Holmes: Estudio en escarlata', 'Primera aventura del detective', 'libro', 14.90, 16, 'disponible', '2024-03-01', 10.50, 10, NULL),
('La chica del tren', 'Thriller psicológico adictivo', 'libro', 19.50, 15, 'disponible', '2024-03-02', 14.00, 10, NULL),
('El silencio de los corderos', 'Thriller sobre un asesino en serie', 'libro', 18.90, 12, 'disponible', '2024-03-03', 14.00, 10, NULL),
('Orgullo y prejuicio', 'Romance clásico de Jane Austen', 'libro', 16.90, 22, 'disponible', '2024-03-04', 12.50, 11, NULL),
('Jane Eyre', 'Historia de amor y superación', 'libro', 18.50, 18, 'disponible', '2024-03-05', 13.50, 11, NULL),
('Cumbres borrascosas', 'Pasión destructiva en los páramos', 'libro', 17.90, 14, 'disponible', '2024-03-06', 13.00, 11, NULL),
('Sentido y sensibilidad', 'Romance y razón en conflicto', 'libro', 16.50, 16, 'disponible', '2024-03-07', 12.00, 11, NULL),
('Lo que el viento se llevó', 'Épica romántica en la Guerra Civil', 'libro', 29.90, 10, 'disponible', '2024-03-08', 22.00, 11, NULL);

-- ========== 50 PAPELERÍA ==========
INSERT INTO productos (nombre_libro, descripcion, tipo_producto, precio, stock, estado, fecha_alta, costo_real, id_categoria_libro, id_categoria_papeleria) VALUES 
('Mochila escolar azul', 'Mochila resistente con múltiples compartimentos', 'papeleria', 35.90, 50, 'disponible', '2024-03-10', 25.00, NULL, 1),
('Mochila deportiva Nike', 'Mochila deportiva de alta calidad', 'papeleria', 45.00, 30, 'disponible', '2024-03-11', 32.00, NULL, 1),
('Mochila universitaria gris', 'Mochila con compartimento para portátil', 'papeleria', 42.50, 40, 'disponible', '2024-03-12', 30.00, NULL, 1),
('Mochila infantil Spiderman', 'Mochila con diseño de superhéroe', 'papeleria', 28.90, 35, 'disponible', '2024-03-13', 20.00, NULL, 1),
('Agenda 2025 ejecutiva', 'Agenda día por página de cuero', 'papeleria', 18.90, 60, 'disponible', '2024-03-14', 13.50, NULL, 2),
('Agenda 2025 escolar', 'Agenda semanal para estudiantes', 'papeleria', 12.50, 80, 'disponible', '2024-03-15', 9.00, NULL, 2),
('Agenda 2025 minimalista', 'Agenda con diseño simple y elegante', 'papeleria', 15.90, 55, 'disponible', '2024-03-16', 11.00, NULL, 2),
('Planificador mensual 2025', 'Planificador con vista mensual', 'papeleria', 14.50, 45, 'disponible', '2024-03-17', 10.00, NULL, 2),
('Cuaderno A4 cuadriculado', 'Cuaderno 100 hojas de calidad', 'papeleria', 3.50, 150, 'disponible', '2024-03-18', 2.50, NULL, 3),
('Cuaderno A5 rayado', 'Cuaderno tamaño medio 80 hojas', 'papeleria', 2.80, 200, 'disponible', '2024-03-19', 2.00, NULL, 3),
('Libreta espiral A4', 'Libreta con espiral metálico', 'papeleria', 4.50, 120, 'disponible', '2024-03-20', 3.20, NULL, 3),
('Bloc notas adhesivas', 'Pack de 5 blocs de colores', 'papeleria', 5.90, 100, 'disponible', '2024-03-21', 4.00, NULL, 3),
('Recambio hojas A4', 'Paquete 500 hojas cuadriculadas', 'papeleria', 6.50, 80, 'disponible', '2024-03-22', 4.50, NULL, 3),
('Cuaderno Moleskine', 'Cuaderno de lujo tapa dura', 'papeleria', 18.90, 40, 'disponible', '2024-03-23', 13.50, NULL, 3),
('Tarjetas de felicitación', 'Pack 10 tarjetas con sobres', 'papeleria', 8.90, 70, 'disponible', '2024-03-24', 6.00, NULL, 4),
('Papel de regalo navideño', 'Rollo 5 metros diseños variados', 'papeleria', 4.50, 90, 'disponible', '2024-03-25', 3.00, NULL, 4),
('Sobres de colores', 'Pack 25 sobres tamaño carta', 'papeleria', 3.90, 85, 'disponible', '2024-03-26', 2.50, NULL, 4),
('Etiquetas adhesivas', 'Pack 100 etiquetas decorativas', 'papeleria', 5.50, 65, 'disponible', '2024-03-27', 3.80, NULL, 4),
('Papel A4 80g', 'Resma 500 hojas blancas', 'papeleria', 7.50, 200, 'disponible', '2024-03-28', 5.20, NULL, 5),
('Papel fotográfico', 'Pack 20 hojas glossy A4', 'papeleria', 12.90, 45, 'disponible', '2024-03-29', 9.00, NULL, 5),
('Papel kraft', 'Rollo 10 metros marrón', 'papeleria', 6.90, 55, 'disponible', '2024-03-30', 4.80, NULL, 5),
('Cartulinas colores', 'Pack 50 cartulinas A4', 'papeleria', 8.90, 60, 'disponible', '2024-03-31', 6.20, NULL, 5),
('Pluma estilográfica Parker', 'Pluma de lujo con estuche', 'papeleria', 45.00, 25, 'disponible', '2024-04-01', 32.00, NULL, 6),
('Bolígrafo Montblanc', 'Bolígrafo de alta gama', 'papeleria', 380.00, 10, 'disponible', '2024-04-02', 270.00, NULL, 6),
('Set de plumas caligrafía', 'Kit completo de caligrafía', 'papeleria', 28.50, 30, 'disponible', '2024-04-03', 20.00, NULL, 6),
('Portaminas profesional', 'Portaminas metálico 0.5mm', 'papeleria', 15.90, 40, 'disponible', '2024-04-04', 11.00, NULL, 6),
('Set acuarelas profesional', 'Caja 24 colores acuarela', 'papeleria', 32.90, 35, 'disponible', '2024-04-05', 23.00, NULL, 7),
('Lápices de colores Faber-Castell', 'Caja 48 lápices profesionales', 'papeleria', 28.50, 40, 'disponible', '2024-04-06', 20.00, NULL, 7),
('Set rotuladores Copic', 'Set 12 rotuladores para manga', 'papeleria', 55.00, 20, 'disponible', '2024-04-07', 39.00, NULL, 7),
('Sketchbook A4', 'Cuaderno dibujo 100 hojas', 'papeleria', 14.90, 45, 'disponible', '2024-04-08', 10.50, NULL, 7),
('Témperas escolares', 'Set 12 botes de colores', 'papeleria', 9.90, 60, 'disponible', '2024-04-09', 7.00, NULL, 7),
('Kit manualidades infantil', 'Set completo de materiales creativos', 'papeleria', 18.90, 50, 'disponible', '2024-04-10', 13.50, NULL, 7),
('Óleo profesional', 'Set 12 tubos colores básicos', 'papeleria', 42.00, 25, 'disponible', '2024-04-11', 30.00, NULL, 8),
('Pinceles artísticos', 'Set 10 pinceles variados', 'papeleria', 24.50, 35, 'disponible', '2024-04-12', 17.50, NULL, 8),
('Lienzo preparado 50x60', 'Lienzo sobre bastidor', 'papeleria', 16.90, 30, 'disponible', '2024-04-13', 12.00, NULL, 8),
('Caballete de madera', 'Caballete plegable profesional', 'papeleria', 68.00, 15, 'disponible', '2024-04-14', 48.00, NULL, 8),
('Calculadora científica Casio', 'Calculadora con funciones avanzadas', 'papeleria', 28.90, 50, 'disponible', '2024-04-15', 20.50, NULL, 9),
('Calculadora básica', 'Calculadora de escritorio 12 dígitos', 'papeleria', 12.50, 70, 'disponible', '2024-04-16', 8.80, NULL, 9),
('Destructora de papel', 'Destructora con corte en tiras', 'papeleria', 85.00, 20, 'disponible', '2024-04-17', 60.00, NULL, 9),
('Plastificadora A4', 'Máquina plastificar documentos', 'papeleria', 45.00, 18, 'disponible', '2024-04-18', 32.00, NULL, 9),
('Archivador palanca A4', 'Archivador lomo 75mm', 'papeleria', 4.50, 150, 'disponible', '2024-04-19', 3.20, NULL, 10),
('Carpeta anillas', 'Carpeta 4 anillas tamaño A4', 'papeleria', 3.90, 120, 'disponible', '2024-04-20', 2.70, NULL, 10),
('Separadores índice', 'Juego 12 separadores de colores', 'papeleria', 2.90, 100, 'disponible', '2024-04-21', 2.00, NULL, 10),
('Cajas archivo', 'Pack 10 cajas cartón A4', 'papeleria', 15.90, 60, 'disponible', '2024-04-22', 11.00, NULL, 10),
('Fundas portadocumentos', 'Pack 100 fundas transparentes', 'papeleria', 8.50, 80, 'disponible', '2024-04-23', 6.00, NULL, 10),
('Estuche triple', 'Estuche 3 compartimentos', 'papeleria', 12.90, 65, 'disponible', '2024-04-24', 9.00, NULL, 12),
('Estuche cilíndrico', 'Estuche redondo con cremallera', 'papeleria', 8.90, 85, 'disponible', '2024-04-25', 6.20, NULL, 12),
('Portatodo enrollable', 'Estuche enrollable para lápices', 'papeleria', 14.50, 45, 'disponible', '2024-04-26', 10.00, NULL, 12),
('Bolígrafos BIC azul', 'Pack 10 bolígrafos', 'papeleria', 3.50, 200, 'disponible', '2024-04-27', 2.50, NULL, 13),
('Lápices HB', 'Pack 12 lápices grafito', 'papeleria', 4.90, 150, 'disponible', '2024-04-28', 3.40, NULL, 13),
('Goma de borrar Milán', 'Pack 3 gomas blancas', 'papeleria', 1.90, 180, 'disponible', '2024-04-29', 1.30, NULL, 13);


-- ============================================
-- PARTE 2: DETALLE_LIBRO (solo para los 50 libros)
-- ============================================

INSERT INTO detalle_libro (ISBN, idioma, editorial, fecha_publicacion, autor, numero_paginas, id_producto) VALUES
(9788437604947, 'Español', 'Cátedra', '1605-01-16', 'Miguel de Cervantes', 1200, 1),
(9788497592208, 'Español', 'Alfaguara', '1967-05-30', 'Gabriel García Márquez', 496, 2),
(9788408163251, 'Español', 'Planeta', '2001-04-17', 'Carlos Ruiz Zafón', 576, 3),
(9788497592457, 'Español', 'Debolsillo', '1985-12-05', 'Gabriel García Márquez', 496, 4),
(9788491050735, 'Español', 'Alianza Editorial', '1866-01-01', 'Fiódor Dostoyevski', 736, 5),
(9788420471808, 'Español', 'Alfaguara', '1963-06-28', 'Julio Cortázar', 600, 6),
(9788497592437, 'Español', 'Plaza & Janés', '1982-10-26', 'Isabel Allende', 464, 7),
(9788497593656, 'Español', 'Plaza & Janés', '1989-09-01', 'Ken Follett', 1008, 8),
(9788432217265, 'Español', 'Seix Barral', '1948-01-01', 'Ernesto Sabato', 160, 9),
(9788420412146, 'Español', 'Alfaguara', '1963-10-01', 'Mario Vargas Llosa', 416, 10),
(9788493442965, 'Español', 'RM', '1955-03-19', 'Juan Rulfo', 144, 11),
(9786070710278, 'Español', 'Debolsillo', '1989-01-01', 'Laura Esquivel', 256, 12),
(9788408163268, 'Español', 'Planeta', '2008-04-17', 'Carlos Ruiz Zafón', 672, 13),
(9788497592888, 'Español', 'Diana', '1981-04-05', 'Gabriel García Márquez', 128, 14),
(9788432217271, 'Español', 'Seix Barral', '1985-03-01', 'Patrick Süskind', 320, 15),
(9788499890944, 'Español', 'Debolsillo', '1949-06-08', 'George Orwell', 352, 16),
(9788497594257, 'Español', 'Debolsillo', '1932-01-01', 'Aldous Huxley', 288, 17),
(9788497594639, 'Español', 'Debolsillo', '1953-10-19', 'Ray Bradbury', 224, 18),
(9788497599405, 'Español', 'Debolsillo', '1951-05-01', 'Isaac Asimov', 304, 19),
(9788497594820, 'Español', 'Debolsillo', '1965-08-01', 'Frank Herbert', 688, 20),
(9788445000663, 'Español', 'Minotauro', '1954-07-29', 'J.R.R. Tolkien', 1200, 21),
(9788498386561, 'Español', 'Salamandra', '1997-06-26', 'J.K. Rowling', 256, 22),
(9788408043464, 'Español', 'Destino', '1950-10-16', 'C.S. Lewis', 768, 23),
(9788445000656, 'Español', 'Minotauro', '1937-09-21', 'J.R.R. Tolkien', 352, 24),
(9788499185873, 'Español', 'Roca Editorial', '2003-08-26', 'Christopher Paolini', 544, 25),
(9788497594912, 'Español', 'Debolsillo', '1862-01-01', 'Victor Hugo', 1488, 26),
(9788497594080, 'Español', 'Debolsillo', '1869-01-01', 'León Tolstói', 1408, 27),
(9788497935999, 'Español', 'Debolsillo', '1980-10-28', 'Umberto Eco', 664, 28),
(9788497594356, 'Español', 'Debolsillo', '1844-01-01', 'Alexandre Dumas', 736, 29),
(9788420633671, 'Español', 'Alianza Editorial', '1819-12-01', 'Walter Scott', 560, 30),
(9788478885978, 'Español', 'Salamandra', '1943-04-06', 'Antoine de Saint-Exupéry', 96, 31),
(9788420412696, 'Español', 'Alfaguara', '1988-10-01', 'Roald Dahl', 240, 32),
(9788420412689, 'Español', 'Alfaguara', '1964-01-17', 'Roald Dahl', 192, 33),
(9788484647263, 'Español', 'Kalandraka', '1963-01-01', 'Maurice Sendak', 48, 34),
(9788484648895, 'Español', 'Macmillan', '1999-03-01', 'Julia Donaldson', 32, 35),
(9788415594079, 'Español', 'Nube de Tinta', '2012-01-10', 'John Green', 304, 36),
(9788427202139, 'Español', 'Molino', '2008-09-14', 'Suzanne Collins', 400, 37),
(9788427203013, 'Español', 'Molino', '2011-05-03', 'Veronica Roth', 512, 38),
(9788420410111, 'Español', 'Alfaguara', '2005-10-05', 'Stephenie Meyer', 512, 39),
(9788498382662, 'Español', 'Salamandra', '2005-06-28', 'Rick Riordan', 400, 40),
(9788467007299, 'Español', 'Espasa', '1934-01-01', 'Agatha Christie', 256, 41),
(9788479537593, 'Español', 'Umbriel', '2003-03-18', 'Dan Brown', 656, 42),
(9788491050421, 'Español', 'Alianza Editorial', '1887-11-01', 'Arthur Conan Doyle', 144, 43),
(9788408154686, 'Español', 'Planeta', '2015-01-13', 'Paula Hawkins', 416, 44),
(9788420686684, 'Español', 'Alfaguara', '1988-01-01', 'Thomas Harris', 384, 45),
(9788491050155, 'Español', 'Alianza Editorial', '1813-01-28', 'Jane Austen', 416, 46),
(9788491050193, 'Español', 'Alianza Editorial', '1847-10-16', 'Charlotte Brontë', 624, 47),
(9788491050209, 'Español', 'Alianza Editorial', '1847-12-01', 'Emily Brontë', 416, 48),
(9788491050186, 'Español', 'Alianza Editorial', '1811-10-30', 'Jane Austen', 384, 49),
(9788467007305, 'Español', 'Espasa', '1936-06-30', 'Margaret Mitchell', 1024, 50);

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