# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- **Start development server**: `npm start` or `yarn start` - Runs on http://localhost:3000
- **Build for production**: `npm run build` or `yarn build`
- **Run tests**: `npm test` or `yarn test`
- **TypeScript check**: Uses built-in Create React App TypeScript checking
- **Lint**: No specific lint command configured (uses Create React App defaults)

## Project Architecture

This is a React TypeScript application for personal finance management, built with Create React App. It communicates with a backend API hosted on Render.

### Core Architecture
- **Frontend Framework**: React 17 with TypeScript
- **Routing**: React Router DOM v6 with centralized route definitions in `src/routes.tsx`
- **State Management**: React Query (@tanstack/react-query) for server state management
- **HTTP Client**: Axios configured in `src/services/api.ts` with base URL from environment variables
- **UI Framework**: Material-UI v4/v5 hybrid with Bootstrap 4 and styled-components
- **Styling**: Global CSS (`src/global.css`) + component-level styling

### Backend Integration
- **API Base URL**: Configured via `REACT_APP_BACKEND_URL` environment variable
- **Current Backend**: `https://mypersonalfinances-server.onrender.com` (development)
- **Proxy**: Development proxy set to `http://localhost:3333` in package.json

### Directory Structure
```
src/
├── components/          # Reusable UI components
│   ├── HeaderToolBar/
│   ├── LeftSideToolBar/
│   ├── InputNumber/
│   └── [Form components for entities]
├── pages/              # Route-level page components
│   ├── Estabelecimento/    # Establishments management
│   ├── TiposEstabelecimento/
│   ├── DescricaoExtra/     # Extra descriptions
│   ├── ClassificacaoExtra/
│   └── Lancamentos/        # Transactions/Entries
├── interfaces/         # TypeScript interfaces
│   ├── IEstabelecimento.ts
│   ├── IDescricaoExtra.ts
│   ├── IEntidadeGenerica.ts
│   └── IValueLabelPair.ts
├── services/          # API and external service integrations
│   └── api.ts
├── Helper/           # Utility functions
└── routes.tsx       # Application routing configuration
```

### Key Domain Concepts
- **Estabelecimentos**: Business establishments/merchants
- **Tipos de Estabelecimento**: Business types/categories
- **Descrição Extra**: Additional descriptions for transactions
- **Classificação Extra**: Additional classification system
- **Lançamentos**: Financial transactions/entries

### Component Patterns
- Components follow a directory-per-component structure with `index.tsx`
- Pages and components are organized by feature/domain
- Form components typically handle both create and edit operations
- Uses TypeScript interfaces for type safety across the application

### Environment Configuration
- Uses `.env.development` for development-specific environment variables
- Backend URL is configurable via `REACT_APP_BACKEND_URL`

## Development Notes
- This appears to be a Portuguese-language personal finance application
- The codebase shows signs of migration/refactoring (mixed Material-UI versions)
- Uses Create React App configuration with no custom webpack setup
- No custom ESLint or Prettier configuration detected beyond CRA defaults