# Email Builder Application

## Overview

This is a full-stack email template builder application that allows users to create, edit, and manage professional email templates through a drag-and-drop interface. The application features a React frontend with a modern UI built using shadcn/ui components and an Express.js backend with PostgreSQL database integration via Drizzle ORM.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query (React Query) for server state management
- **Styling**: Tailwind CSS with custom design system using CSS variables
- **UI Components**: shadcn/ui component library with Radix UI primitives
- **Email Builder**: Integration with @usewaypoint/email-builder for visual email template creation

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **API Design**: RESTful APIs with structured error handling and logging middleware
- **Database Integration**: Drizzle ORM for type-safe database operations
- **Storage Strategy**: Hybrid approach with in-memory storage (MemStorage) for development and PostgreSQL for production
- **Session Management**: Session-based approach with connect-pg-simple for PostgreSQL session store

### Database Schema
- **Users Table**: Basic user authentication with username/password
- **Email Templates Table**: Stores template metadata, JSON content structure, and optional HTML output
- **Relationships**: Templates can be associated with users or remain public/shared

### Data Storage Design
- **Template Content**: JSON-based storage for flexible component structure
- **HTML Generation**: Optional pre-compiled HTML storage for performance
- **Schema Validation**: Zod schemas for runtime type checking and API validation

### Development Workflow
- **Hot Reloading**: Vite development server with HMR
- **Type Safety**: Shared TypeScript types between frontend and backend
- **Database Migrations**: Drizzle Kit for schema management
- **Build Process**: Separate builds for client (Vite) and server (esbuild)

### Authentication & Authorization
- **Basic Authentication**: Username/password system ready for extension
- **Session-based**: Server-side session management
- **Optional User Association**: Templates can be created with or without user accounts

## External Dependencies

### Database & ORM
- **PostgreSQL**: Primary database (configured via DATABASE_URL)
- **Neon Database**: Serverless PostgreSQL integration
- **Drizzle ORM**: Type-safe database client and migration tool

### UI & Styling
- **Radix UI**: Accessible component primitives for complex UI elements
- **Tailwind CSS**: Utility-first CSS framework with custom design tokens
- **Lucide React**: Icon library for consistent iconography
- **Google Fonts**: Inter font family for typography

### Email Builder
- **@usewaypoint/email-builder**: Visual email template editor with drag-and-drop functionality
- **React Hook Form**: Form state management with validation
- **Zod**: Runtime type validation and schema definition

### Development Tools
- **TypeScript**: Static type checking across the full stack
- **Vite**: Fast build tool with plugin ecosystem
- **ESBuild**: Fast JavaScript bundler for server builds
- **Replit Integration**: Development environment optimizations and error overlays

### Utility Libraries
- **date-fns**: Date manipulation and formatting
- **clsx & tailwind-merge**: Conditional CSS class management
- **nanoid**: Unique ID generation
- **class-variance-authority**: Component variant management