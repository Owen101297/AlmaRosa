# Karen Guerrero - Tienda de Lencería

## Overview

Online lingerie store for "Karen Guerrero" brand. E-commerce experience with product catalog, shopping cart, WhatsApp checkout, and premium visual design.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle for API), Vite (frontend)
- **Frontend**: React + Vite + Tailwind CSS
- **Routing**: Wouter
- **State management**: React Context (cart)

## Architecture

- `artifacts/karen-guerrero/` — React frontend (Vite)
- `artifacts/api-server/` — Express API server
- `lib/db/` — Database schema (Drizzle ORM)
- `lib/api-spec/` — OpenAPI specification
- `lib/api-client-react/` — Generated React Query hooks
- `lib/api-zod/` — Generated Zod validation schemas

## Database Tables

- `categories` — Product categories (Conjuntos, Brasieres, Pijamas, Bodys, Ropa Deportiva)
- `products` — Products with name, description, price, salePrice, images, sizes, featured, isNew
- `testimonials` — Customer testimonials with name, comment, rating, avatar

## API Endpoints

- `GET /api/products` — List products (filters: categoryId, featured, minPrice, maxPrice, size)
- `GET /api/products/:id` — Get single product
- `GET /api/products/summary` — Product summary with counts by category
- `GET /api/products/new-arrivals` — Newest products
- `GET /api/products/on-sale` — Products on sale
- `GET /api/categories` — List categories
- `GET /api/testimonials` — List testimonials
- `GET /api/images/*` — Static image serving from attached_assets

## Frontend Pages

- `/` — Landing page (hero, categories, featured products, experience, testimonials)
- `/tienda` — Full product catalog with filters
- `/producto/:id` — Product detail page
- `/colecciones` — Browse by collection/category
- `/ofertas` — Products on sale

## Key Features

- Shopping cart (client-side Context)
- WhatsApp floating button with pre-filled message
- WhatsApp checkout flow
- Category and size filtering
- Responsive design (mobile-first)
- Dark luxury aesthetic with rose/gold accents

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/scripts run seed` — seed database with sample data
- `pnpm --filter @workspace/api-server run dev` — run API server locally

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.
