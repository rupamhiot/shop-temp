# Overview

This is a dual-sided e-commerce marketplace platform called "ShopHub" that connects buyers with independent sellers. The platform enables users to browse and purchase unique products while allowing sellers to list and manage their inventory through a dedicated dashboard. Built with a modern React frontend and Express backend, it uses PostgreSQL for data persistence and follows a clean, component-based architecture inspired by platforms like Shopify, Etsy, and Airbnb.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture

**Technology Stack:**
- React with TypeScript for type-safe component development
- Wouter for lightweight client-side routing
- TanStack Query (React Query) for server state management and caching
- Vite as the build tool and development server
- Tailwind CSS for utility-first styling with shadcn/ui component library

**Design System:**
- Follows a reference-based hybrid approach drawing from Shopify (buyer interface), Linear/Notion (seller dashboard), and Airbnb (landing page)
- Uses Inter font family for headings and UI elements with system fonts for body text
- Implements a consistent spacing system based on Tailwind units (2, 4, 6, 8, 12, 16, 20, 24)
- Custom color theme system with CSS variables for light/dark mode support
- Component library built on Radix UI primitives for accessibility

**Key Frontend Patterns:**
- Page-based routing with dedicated routes for landing, shop, product details, and seller dashboard
- Form validation using react-hook-form with Zod schema validation
- Shared UI components from shadcn/ui (buttons, cards, dialogs, forms, etc.)
- Session-based shopping cart management
- Optimistic UI updates with query invalidation for real-time feedback

## Backend Architecture

**Technology Stack:**
- Express.js as the web server framework
- TypeScript for type safety across the stack
- Drizzle ORM for database interactions
- PostgreSQL (via Neon serverless) as the database
- Session-based state management for cart functionality

**Server Structure:**
- Development mode uses Vite middleware for HMR and SSR
- Production mode serves static assets from dist/public
- API routes handle CRUD operations for products, categories, cart, and orders
- In-memory storage layer with interface designed for easy database migration

**API Design:**
- RESTful API endpoints under `/api` prefix
- Products: GET /api/products, GET /api/products/:id, POST /api/products, PATCH /api/products/:id
- Categories: GET /api/categories
- Cart: GET /api/cart, POST /api/cart, PATCH /api/cart/:id, DELETE /api/cart/:id
- Orders: GET /api/orders, POST /api/orders
- Request/response validation using Zod schemas from shared types

## Data Layer

**Database Schema (PostgreSQL with Drizzle ORM):**

**Categories Table:**
- Stores product categories with slug-based routing
- Fields: id (UUID), name, slug (unique), image

**Products Table:**
- Central product catalog with seller attribution
- Fields: id (UUID), name, description, price (decimal), categoryId, categoryName, image, images (array), sellerId, sellerName, stock (integer), status, rating (decimal), reviewCount
- Denormalizes category and seller names for query performance

**Cart Items Table:**
- Session-based shopping cart storage
- Fields: id (UUID), sessionId, productId, quantity
- Links to products via productId

**Orders Table:**
- Order tracking and seller management
- Fields: id (UUID), sellerId, buyerName, buyerEmail, total (decimal), status, createdAt (timestamp)

**Storage Pattern:**
- IStorage interface defines all data operations
- MemStorage provides in-memory implementation for development
- Database-backed implementation would follow the same interface
- Type-safe operations using shared Zod schemas

## External Dependencies

**UI Component Library:**
- Radix UI primitives for accessible, unstyled components
- shadcn/ui for pre-styled component variants
- Lucide React for icon system
- Embla Carousel for product image galleries

**Form and Validation:**
- react-hook-form for form state management
- Zod for schema validation and type inference
- @hookform/resolvers for integration

**Database and ORM:**
- Drizzle ORM for type-safe database queries
- @neondatabase/serverless for PostgreSQL connection
- drizzle-zod for automatic schema to Zod type generation

**Development Tools:**
- Vite plugins for Replit integration (@replit/vite-plugin-runtime-error-modal, @replit/vite-plugin-cartographer, @replit/vite-plugin-dev-banner)
- ESBuild for production bundling
- PostCSS with Tailwind and Autoprefixer

**Session Management:**
- connect-pg-simple for PostgreSQL session store
- Express session middleware (implied by storage architecture)

**Utility Libraries:**
- date-fns for date manipulation
- clsx and tailwind-merge for className utilities
- class-variance-authority for component variant management
- nanoid for unique ID generation