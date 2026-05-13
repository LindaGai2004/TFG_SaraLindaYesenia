# 📚 Archives — Librería online con asistente inteligente

> Plataforma ecommerce de libros y papelería con un chatbot conversacional impulsado por IA, desarrollada como Trabajo de Fin de Grado del ciclo de Desarrollo de Aplicaciones Web (DAW).

---

## ✨ Descripción

**Archives** es una aplicación web completa que combina una tienda online de libros y papelería con funcionalidades sociales (publicaciones, seguimientos, comentarios) y un asistente inteligente capaz de recomendar productos, responder preguntas frecuentes y ayudar al usuario a navegar el catálogo en lenguaje natural.

El proyecto sigue una **arquitectura híbrida** intencionada: un monolito en Spring Boot que gestiona toda la lógica de negocio principal, y un microservicio independiente para el chatbot. Esta separación permite que el chatbot evolucione, escale o se sustituya sin afectar al resto del sistema.

---

## 🏗️ Arquitectura

```
┌─────────────────────────┐
│   React Frontend        │
│   (Vite, puerto 5173)   │
└───────────┬─────────────┘
            │
    ┌───────┴───────┐
    ↓               ↓
┌─────────────┐  ┌─────────────────┐
│  Monolito   │  │  Microservicio  │
│ Spring Boot │  │    Chatbot      │
│ puerto 9001 │  │  puerto 8081    │
└──────┬──────┘  └────────┬────────┘
       │                  │
       │      consulta    │
       │ ←────────────────┘
       ↓
┌─────────────┐
│   MySQL 8   │
└─────────────┘
```

### ¿Por qué híbrida y no todo monolito o todo microservicios?

Pasar todo a microservicios habría sido sobreingeniería para el alcance de un TFG. Mantenerlo todo como monolito habría dejado fuera el aprendizaje de comunicación entre servicios. La arquitectura híbrida nos permitió:

- Aislar la integración con un servicio externo (OpenAI) en su propio proceso
- Practicar comunicación HTTP entre servicios con DTOs y desacoplamiento
- Mantener la estabilidad del ecommerce principal sin riesgo
- Demostrar comprensión tanto de patrones monolíticos como de microservicios

---

## 🛠️ Stack tecnológico

### Backend monolito
- **Java 21** + **Spring Boot 3**
- **Spring Security** con autenticación **JWT**
- **JPA / Hibernate** con herencia JOINED (`Producto` → `Libro` / `Papeleria`)
- **MySQL 8** como base de datos
- **Maven** para gestión de dependencias
- **PayPal SDK** para integración de pagos (entorno sandbox)
- **JavaMail** para verificación de cuentas y recuperación de contraseña

### Microservicio chatbot
- **Java 17** + **Spring Boot 3**
- **WebClient** para llamadas HTTP al monolito
- **Jackson** para serialización JSON
- Integración con la **API de OpenAI** (modelo GPT-4o-mini)

### Frontend
- **React 18** con **Vite**
- **React Router DOM** para enrutamiento
- **Axios** para peticiones HTTP
- CSS puro

---

## 🎯 Funcionalidades principales

### Tienda
- Catálogo de libros y papelería con filtros por género, idioma, categoría, marca, precio y estado
- Sistema de favoritos
- Carrito de compra persistente
- Pasarela de pago con PayPal
- Historial de pedidos

### Cuentas y seguridad
- Registro con verificación por email
- Login con JWT y roles (`ADMON`, `JEFE`, `TRABAJADOR`, `CLIENTE`)
- Recuperación de contraseña por código

### Comunidad
- Publicaciones con texto, imagen y producto etiquetado
- Sistema de likes y comentarios
- Seguimientos entre usuarios
- Usuarios recomendados

### Dashboards
- Panel de administrador con métricas de ventas, clientes, pedidos
- Gestión de jefes y trabajadores
- Selección de "libro del mes" destacado
- Vista personalizada para cliente con historial, favoritos y pedidos

### Asistente inteligente
- Recomendación de libros por género, autor o tema
- Recomendación de papelería por categoría
- Filtrado por precio en lenguaje natural
- Refinamiento conversacional con historial de contexto
- Preguntas frecuentes sobre envíos, devoluciones y pagos
- Navegación directa a fichas de producto

---

## 🚀 Cómo ejecutar el proyecto localmente

### Requisitos previos
- **Java 21** (para el monolito)
- **Java 17 o superior** (para el chatbot-service)
- **Node.js 18+** y **npm**
- **MySQL 8** corriendo en `localhost:3306`
- Una **API key de OpenAI** (para el chatbot)

### 1. Base de datos

```bash
mysql -u root -p < Back/script_bbdd_security_2026.sql
```

Esto creará la base de datos `tfg_2026` con todas las tablas y datos de ejemplo.

### 2. Monolito (puerto 9001)

```bash
cd Back/01_proyecto_LindaSaraYesenia
./mvnw spring-boot:run
```

Configura tus credenciales en `src/main/resources/application.properties`:
- Usuario y contraseña de MySQL
- Credenciales de PayPal sandbox
- Credenciales SMTP para envío de emails

### 3. Microservicio chatbot (puerto 8081)

```bash
cd Back/chatbot-service
./mvnw spring-boot:run
```

Configura tu API key de OpenAI en `src/main/resources/application.properties`.

### 4. Frontend (puerto 5173)

```bash
cd Front/TFG_SaraLindaYesenia_Final/react-login-demo
npm install
npm run dev
```

La aplicación estará disponible en http://localhost:5173

---

## 📁 Estructura del repositorio

```
TFG_SaraLindaYesenia/
├── Back/
│   ├── 01_proyecto_LindaSaraYesenia/   # Monolito Spring Boot
│   ├── chatbot-service/                # Microservicio del chatbot
│   └── script_bbdd_security_2026.sql   # Script de BBDD
└── Front/
    └── TFG_SaraLindaYesenia_Final/
        └── react-login-demo/           # Frontend React
```

---

## 🔮 Próximos pasos

El proyecto está preparado para evolucionar hacia un despliegue real:

- [ ] **Containerización** con Docker para cada servicio
- [ ] **Orquestación local** con docker-compose (incluyendo MySQL)
- [ ] **Despliegue** en entorno cloud
- [ ] Externalización completa de credenciales mediante variables de entorno
- [ ] Tests automatizados de integración
- [ ] Pipeline de CI/CD con GitHub Actions

Las decisiones arquitectónicas tomadas (rutas configurables vía `application.properties`, separación monolito/microservicio, DTOs para comunicación entre servicios) facilitan esta evolución.

---

## 👥 Equipo

Este proyecto fue desarrollado por:

- **Sara**
- **Linda**
- **Yesenia**

Trabajo de Fin de Grado — DAW (Desarrollo de Aplicaciones Web) — 2026

---

---

## 🌐 English summary

**Archives** is a hybrid e-commerce web application for books and stationery, built as a final degree project.

It combines a **Spring Boot 3 monolith** (handling products, users, orders, cart, PayPal payments, social posts and dashboards) with an **independent Spring Boot microservice** for an AI-powered chatbot that uses OpenAI's GPT-4o-mini to recommend products, answer FAQs and help users navigate the catalogue conversationally. The frontend is a **React + Vite** SPA that communicates with both backends.

### Tech stack
- Backend monolith: Java 21, Spring Boot 3, Spring Security (JWT), JPA/Hibernate, MySQL 8, Maven
- Chatbot microservice: Java 17+, Spring Boot 3, WebClient, OpenAI API
- Frontend: React 18, Vite, React Router, Axios

### Architecture rationale
A pure microservices architecture would have been overengineering for the project scope. A pure monolith would have eliminated the chance to practice inter-service communication. The hybrid approach let us isolate the AI integration in its own deployable unit while keeping the core e-commerce monolith stable and simple.

### Local setup
Run the SQL script against MySQL, then start the three services in order: monolith on port 9001, chatbot on 8081, frontend on 5173. See the Spanish setup section above for full details.

### Roadmap
Containerization with Docker, deployment to a cloud platform, environment-based configuration, integration tests and a CI/CD pipeline are the planned next steps.

---

*Built with care by Sara, Linda & Yesenia. 2026.*
