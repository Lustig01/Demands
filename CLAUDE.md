# Resource Demand Management System

A monorepo project to replace an Excel-based process for requesting infrastructure resources (CPU, RAM, etc.). The system acts as a single source of truth with an "Excel-like" UI featuring dense tables, bulk actions, and filters.

## Project Structure

```
demands/
├── client/          # Frontend - React + Vite + TypeScript
├── server/          # Backend - Express + Node.js + TypeScript
└── package.json     # Root package.json for monorepo scripts
```

## Tech Stack

### Backend (server/)
- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **ORM**: Prisma
- **Middleware**: cors, helmet, morgan

### Frontend (client/)
- **Framework**: React with TypeScript
- **Build Tool**: Vite

## Domain Model

### Organization Hierarchy
- **Center** → **Branch** → **Section**

### Location Model
- **Location** composed of: Base, Environment, Network

### Service Model
- **Service** → **Resource** (with unit of measurement)
- **Capacity**: Available resources at a specific location

### Request Model
- **Project**: Groups related demands
- **Demand**: Individual resource request

## Development

### Running the project
```bash
# Install all dependencies
npm install

# Run both client and server in development
npm run dev

# Run only server
npm run dev:server

# Run only client
npm run dev:client
```

### Building
```bash
# Build both client and server
npm run build

# Build only server
npm run build:server

# Build only client
npm run build:client
```

## API Endpoints

- `GET /` - API info
- `GET /health` - Health check

## Environment Variables

Create `.env` files in respective packages:

### server/.env
```
PORT=3000
DATABASE_URL=
```

### client/.env
```
VITE_API_URL=http://localhost:3000
```
