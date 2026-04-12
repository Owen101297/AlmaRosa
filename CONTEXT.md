# Alma Rosa - Contexto del Proyecto

Este archivo sirve como memoria técnica y contexto para cualquier asistente de IA o desarrollador que trabaje en este proyecto. **Alma Rosa** es una tienda online de lencería de lujo, robusta y escalable.

## 🚀 Estado Actual

- **Frontend y Backend integrados:** El frontend se comunica con un servidor API local.
- **Base de Datos conectada:** Integración completa con Supabase (Postgres).
- **Branding (Phase 2):** In progress. Migrating to an "Editorial Luxury" style to fix logo background clashing and broken product images.
- **Datos (Fixing):** Catalog data is currently being re-synced to ensure images and names are correct across the storefront.
- **Panel de Administración:** Completamente funcional con CRUD de productos, categorías, pedidos y testimonios.

---

## 🛠️ Stack Tecnológico

- **Frontend:** React + Vite + Wouter (en `artifacts/karen-guerrero`).
- **Backend:** Node.js Express (en `artifacts/api-server`).
- **Base de Datos:** PostgreSQL (Supabase) + Drizzle ORM.
- **Gestión de Paquetes:** `pnpm` (Workspace).

---

## 📡 Arquitectura de Conexión

1. **Frontend (Puerto 5173):** Tiene un proxy configurado en `vite.config.ts` para redirigir peticiones `/api` al backend.
2. **Backend (Puerto 5000):** Escucha peticiones y se conecta a Supabase mediante la variable `DATABASE_URL` del archivo `.env` en la raíz.
3. **Base de Datos:** Usa el **Connection Pooler** de Supabase (Puerto 6543) para compatibilidad con redes IPv4/Windows.

---

## 💻 Comandos Útiles

### Iniciar Proyecto (Modo Desarrollo)

Desde la raíz del proyecto, este comando levanta tanto el Frontend como el Backend simultáneamente:

```bash
pnpm run dev
```

### Gestión de Base de Datos

- **Poblar con datos iniciales:**
  ```bash
  cd lib/db
  node seed-products.mjs
  ```
- **Arreglar imágenes/campos específicos:**
  ```bash
  cd lib/db
  node fix-db.mjs
  ```

---

## 🎨 Panel de Administración

### Rutas del Admin

| Ruta                     | Descripción                               |
| ------------------------ | ----------------------------------------- |
| `/admin`                 | Dashboard con estadísticas completas      |
| `/admin/productos`       | Lista de productos con búsqueda y filtros |
| `/admin/productos/nuevo` | Crear nuevo producto                      |
| `/admin/productos/:id`   | Editar producto existente                 |
| `/admin/categorias`      | Gestionar categorías                      |
| `/admin/pedidos`         | Ver pedidos y cambiar estados             |
| `/admin/testimonios`     | Aprobar/ocultar testimonios               |

### Funcionalidades del Dashboard

- ✅ **Stats completos:** Productos, Categorías, Pedidos, Ingresos totales
- ✅ **Alerta de Stock Bajo:** Productos con ≤5 unidades
- ✅ **Estado de Pedidos:** Distribución visual por estado
- ✅ **Últimos Pedidos:** Lista de los 5 pedidos más recientes
- ✅ **Resumen Testimonios:** Publicados vs pendientes
- ⚠️ **Banner de acción:** Cuando hay testimonios pendientes
- ✅ **Botón actualizar:** Recargar estadísticas manualmente
- ✅ **Última actualización:** Fecha/hora visible

### Funcionalidades de Productos

- ✅ Crear, editar, eliminar productos
- ✅ Imágenes via URL (Unsplash)
- ✅ Tallase configurables (XS, S, M, L, XL)
- ✅ Precio regular y precio de oferta
- ✅ Stock inventario
- ✅ Marcar como destacado o nuevo

### Funcionalidades de Pedidos

- ✅ Ver lista de pedidos
- ✅ Cambiar estado (Pendiente → Procesando → Enviado → Entregado)
- ✅ Ver detalles del pedido
- ✅ Modal con productos del pedido

### Funcionalidades de Testimonios

- ✅ Ver todos los testimonios
- ✅ Publicar/ocultar testimonios
- ✅ Eliminar testimonios
- ✅ Rating visual

---

## 🔧 Descuentos y Carrito

### Códigos de Descuento Disponibles

- `BIENVENIDA10` - 10% de descuento
- `ALMAROSA15` - 15% de descuento
- `ENVIOGRATIS` - Envío gratis

### Umbral de Envío Gratis

- Envío gratis a partir de **$999**

---

## 📁 Archivos Clave

- `.env`: Contiene las credenciales de Supabase y el puerto del servidor.
- `artifacts/karen-guerrero/vite.config.ts`: Configuración del proxy `/api`.
- `supabase/migrations/001_initial_setup.sql`: Esquema original de la base de datos.
- `lib/db/seed-products.mjs`: Script para insertar/actualizar productos en la tienda.

---

## 📝 Notas para el Asistente

- Si el backend no conecta, verifica que el IP de Supabase no esté bloqueado o que la cadena de conexión en el `.env` use el puerto **6543**.
- El frontend está en la carpeta `artifacts/karen-guerrero`. Aunque la carpeta tiene ese nombre por el origen del proyecto, la marca visual en toda la app es **Alma Rosa**.
- Todas las peticiones al backend deben empezar con `/api`.
- El panel de admin está disponible en `/admin` (sin autenticación por ahora).
