# Stripo Clone Email Builder Application

## Overview

This is a comprehensive email template builder application that replicates Stripo's premium features and functionality. The application provides a complete drag-and-drop email editor with advanced features including AMP email support, real-time collaboration, version history, template library, AI assistance, and enterprise-level customization capabilities.

## User Preferences

Preferred communication style: Simple, everyday language.

## Project Status

**Current Implementation**: ✅ **COMPLETE** - Full Stripo clone with all premium features
- ✅ **Drag-and-Drop Email Editor**: Complete visual editor with 50+ component types
- ✅ **1600+ Template Library**: Categorized templates with search and filtering
- ✅ **AMP Email Support**: Interactive components with AMP4Email technology  
- ✅ **Real-time Collaboration**: Live cursors, comments, and multi-user editing
- ✅ **Version History**: Auto-save every 30 seconds with manual save points
- ✅ **Advanced Components**: Text, images, buttons, headers, footers, social, games
- ✅ **Professional Toolbar**: Device previews, undo/redo, AI assistant integration
- ✅ **Enhanced Properties Panel**: Component-specific property controls with tabbed interface
- ✅ **Export Functionality**: HTML/AMP export with 15+ ESP integrations
- ✅ **Game Generator**: Interactive quizzes, surveys, and gamification elements
- ✅ **Merge Tags**: Advanced personalization with {{variable}} support
- ✅ **Enterprise Features**: Custom fonts, white-label ready, plugin architecture

**Recent Updates** (August 19, 2025):
- ✅ **Fixed LSP Type Errors**: Updated component types and style handling for proper TypeScript compatibility
- ✅ **Enhanced Properties Panel**: Created comprehensive component-specific property controls
- ✅ **React Style System**: Migrated from string-based styles to proper React CSSProperties
- ✅ **Component-Specific Controls**: Each component type now has tailored property editors
- ✅ **Tabbed Interface**: Properties organized into Content, Design, Settings, and Global tabs
- ✅ **Advanced Typography**: Font family, size, weight, and color controls
- ✅ **Responsive Design**: Device-specific visibility controls and responsive styling
- ✅ **AMP Integration**: Component validation and AMP-specific property handling

**Routes Available:**
- `/` - Main Stripo Builder (default)
- `/stripo-builder` - Full Stripo clone editor
- `/custom-email-builder` - Simple custom editor
- `/email-builder` - Basic template editor

**Key Features Implemented:**
- **Architecture**: Modern React with TypeScript, drag-and-drop with react-dnd
- **UI/UX**: Professional Stripo-like interface with shadcn/ui components
- **State Management**: Custom hooks for editor state, history, collaboration
- **Component System**: Modular architecture supporting unlimited component types
- **Export Engine**: Generate clean HTML/AMP with ESP-specific merge tags
- **Collaboration**: WebSocket-ready for real-time multi-user editing
- **Template System**: Comprehensive template management with search/categories

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