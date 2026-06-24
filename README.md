# JabefSneakers 👟

E-commerce de zapatillas, ropa y accesorios urbanos, con catálogo dinámico, panel de administración y checkout vía WhatsApp (sin pasarela de pago en línea).

## 🚀 Demo

- **Frontend:** https://jabefsneakers-b.vercel.app
- **Backend (API):** desplegado en Railway

## 🛠️ Stack Tecnológico

### Frontend
- React + Vite
- Tailwind CSS
- React Router DOM
- Zustand (manejo del carrito)
- Axios

### Backend
- Node.js + Express
- MySQL (alojado en Railway)
- Prisma ORM
- JWT (autenticación del panel admin)
- bcryptjs (hash de contraseñas)
- Cloudinary (subida y almacenamiento de imágenes)
- Multer (manejo de archivos)

### Infraestructura
- **Railway:** backend + base de datos MySQL
- **Vercel:** frontend
- **Docker:** soporte para desarrollo local (opcional)

## 📦 Características

- Catálogo de productos con filtros por categoría, talla y buscador en tiempo real
- Detalle de producto con selector de talla y cantidad
- Carrito de compras persistente en sesión (Zustand)
- Checkout que genera un pedido en base de datos y redirige a WhatsApp con el resumen de la compra
- Panel de administración protegido con login (JWT)
  - CRUD completo de productos (con tallas, stock por talla, imágenes)
  - CRUD de categorías
  - Subida de imágenes a Cloudinary
- Diseño responsive con menú hamburguesa en mobile

## 📁 Estructura del proyecto

jabefsneakers-b/

├── backend/
│   ├── src/
│   │   ├── config/          # Conexión a Prisma y Cloudinary
│   │   ├── controllers/     # Lógica de negocio por entidad
│   │   ├── routes/          # Definición de endpoints
│   │   ├── middlewares/     # Auth (JWT), manejo de errores, subida de archivos
│   │   ├── services/        # Generación de mensajes de WhatsApp
│   │   ├── utils/           # Scripts auxiliares (crear admin, etc.)
│   │   ├── app.js
│   │   └── server.js
│   ├── prisma/
│   │   ├── schema.prisma    # Modelo de datos
│   │   └── seed.js          # Carga inicial de tallas y categorías
│   ├── Dockerfile
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/      # Componentes reutilizables (catálogo, carrito, admin, layout)
│   │   ├── pages/           # Vistas principales (Home, Catálogo, Detalle, Admin)
│   │   ├── store/           # Estado global del carrito (Zustand)
│   │   ├── services/        # Llamadas a la API (Axios)
│   │   ├── routes/          # Configuración de React Router
│   │   └── utils/           # Funciones auxiliares
│   ├── Dockerfile
│   ├── nginx.conf
│   └── package.json
│
├── docker-compose.yml
└── README.md

## 🗄️ Modelo de datos (resumen)

- **Categoria** → Producto (1 a muchos)
- **Producto** → ProductoImagen, ProductoTalla (1 a muchos)
- **Talla** → ProductoTalla (1 a muchos, tabla intermedia con stock por talla)
- **Pedido** → DetallePedido (1 a muchos)
- **Admin** → usuario del panel de administración

## ⚙️ Instalación y configuración local

### Requisitos previos
- Node.js 20+
- Cuenta en [Railway](https://railway.app) (o cualquier instancia MySQL)
- Cuenta en [Cloudinary](https://cloudinary.com)

### 1. Clonar el repositorio

```bash
git clone https://github.com/Maxchilo23/jabefsneakers-b.git
cd jabefsneakers-b
```

### 2. Configurar el backend

```bash
cd backend
npm install
```

Crea un archivo `.env` en `backend/` con el siguiente contenido:

```env
DATABASE_URL="mysql://usuario:password@host:puerto/basededatos"
PORT=4000
JWT_SECRET=tu_clave_secreta_aqui
WHATSAPP_NUMBER=51987654321
CLOUDINARY_CLOUD_NAME=tu_cloud_name
CLOUDINARY_API_KEY=tu_api_key
CLOUDINARY_API_SECRET=tu_api_secret
```

Ejecuta las migraciones y carga los datos iniciales (tallas y categorías):

```bash
npx prisma migrate dev
npm run seed
```

Crea el usuario administrador inicial:

```bash
node src/utils/crearAdmin.js
```

> Usuario por defecto: `admin` / Contraseña por defecto: `admin123` (cámbiala después del primer login).

Levanta el servidor:

```bash
npm run dev
```

El backend quedará disponible en `http://localhost:4000`.

### 3. Configurar el frontend

```bash
cd ../frontend
npm install
```

Crea un archivo `.env` en `frontend/` con:

```env
VITE_API_URL=http://localhost:4000/api
VITE_WHATSAPP_NUMBER=51987654321
```

Levanta el servidor:

```bash
npm run dev
```

El frontend quedará disponible en `http://localhost:5173`.

## 🐳 Levantar el proyecto con Docker (alternativa)

Desde la raíz del proyecto:

```bash
docker compose up --build
```

Esto construye y levanta automáticamente los contenedores de backend y frontend. Asegúrate de tener el archivo `backend/.env` configurado antes de ejecutar este comando.

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:4000/api/health`

## 🔌 Endpoints principales de la API

| Método | Ruta | Descripción | Protegido |
|--------|------|-------------|-----------|
| GET | `/api/categorias` | Lista todas las categorías | No |
| POST | `/api/categorias` | Crea una categoría | Sí |
| GET | `/api/productos` | Lista productos (con filtros: categoriaId, busqueda, talla) | No |
| GET | `/api/productos/:id` | Detalle de un producto | No |
| POST | `/api/productos` | Crea un producto | Sí |
| PUT | `/api/productos/:id` | Actualiza un producto | Sí |
| DELETE | `/api/productos/:id` | Elimina un producto | Sí |
| GET | `/api/tallas` | Lista todas las tallas disponibles | No |
| POST | `/api/pedidos` | Crea un pedido y genera el link de WhatsApp | No |
| GET | `/api/pedidos` | Lista pedidos (panel admin) | No |
| POST | `/api/auth/login` | Login del panel admin | No |
| POST | `/api/upload` | Sube una imagen a Cloudinary | Sí |

> Las rutas protegidas requieren un header `Authorization: Bearer <token>`.

## 🚢 Despliegue en producción

| Componente | Servicio | Configuración |
|------------|----------|----------------|
| Backend + Base de datos | Railway | Root Directory: `backend` |
| Frontend | Vercel | Root Directory: `frontend` |

Variables de entorno necesarias en cada plataforma:

**Railway (backend):**

DATABASE_URL
JWT_SECRET
WHATSAPP_NUMBER
CLOUDINARY_CLOUD_NAME
CLOUDINARY_API_KEY
CLOUDINARY_API_SECRET

**Vercel (frontend):**

VITE_API_URL
VITE_WHATSAPP_NUMBER

## 👤 Autor

**Max** — Estudiante de Desarrollo de Software en SENATI, Perú.

## 📄 Licencia

Proyecto personal/educativo. Uso libre para fines de aprendizaje.