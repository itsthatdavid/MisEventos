# MisEventos - Event Management Platform

## Overview
A modern event management platform built with React, FastAPI, and PostgreSQL to solve traditional event organization challenges through centralization, automation, and improved user experience.

## Quick Start

```bash
# Clone repository
git clone <repository-url>
cd MisEventos

# Configure environment
cp .env.example .env
cp Backend/.env.example Backend/.env
cp Frontend/.env.example Frontend/.env

# Start all services
docker-compose up -d --build

# Run migrations (after services are up)
docker-compose exec backend alembic upgrade head
```

## Access Points
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs

## Tech Stack & Architecture Decisions

### Backend
- **FastAPI** - Async support for real-time event updates, automatic API documentation
- **PostgreSQL** - Structured data for payment auditing and event relationships
- **SQLModel + SQLAlchemy** - Type-safe models with single source of truth
- **Poetry** - Modern dependency management
- **Alembic** - Database migrations
- **JWT** - Secure authentication

### Frontend
- **React + React Router** - Component reusability and large community support
- **Context API** - State management for auth, events, and UI states
- **Axios** - HTTP client with interceptors for auth tokens

### Infrastructure
- **Docker Compose** - Consistent development environment
- **Soft Delete Pattern** - Data preservation for auditing

## Core Features

### Event Management
- CRUD operations with advanced search
- Session scheduling with conflict validation
- Capacity management and registration control
- Event states: draft, teaser, presale, sale, in_progress, finished, cancelled

### User System
- JWT-based authentication
- Role-based access (future: Admin, Organizer, Attendee)
- Protected routes for event creation/editing

### Session Management
- Multiple sessions per event
- Speaker assignment (no account required)
- Schedule conflict validation
- Independent capacity control

## API Structure

```
/api/v1/
├── /auth
│   ├── POST /register
│   └── POST /login
├── /events
│   ├── GET / (paginated list)
│   ├── POST / (create)
│   ├── GET /search?q={query}
│   ├── GET /{id}
│   ├── PUT /{id}
│   └── DELETE /{id}
├── /events/{id}/sessions
│   ├── GET /
│   ├── POST /
│   └── /{session_id}/register
└── /users/me/events
```

## Development


### Database Operations
```bash
# Create migration
docker-compose exec backend alembic revision --autogenerate -m "description"

# Apply migrations
docker-compose exec backend alembic upgrade head

# Access database
docker-compose exec postgres psql -U postgres -d miseventos
```

### Testing
```bash
# Backend tests with coverage
docker-compose exec backend pytest --cov=app tests/
```

## Project Structure
```
MisEventos/
├── Backend/
│   ├── app/
│   │   ├── api/          # Endpoints
│   │   ├── core/         # Config, security
│   │   ├── models/       # SQLModel definitions
│   │   ├── schemas/      # Pydantic schemas
│   │   └── services/     # Business logic
│   ├── tests/
│   └── alembic/
├── Frontend/
│   ├── src/
│   │   ├── components/   # Reusable UI components
│   │   ├── pages/        # Route components
│   │   ├── contexts/     # State management
│   │   ├── services/     # API calls
│   │   └── utils/        # Helpers
│   └── public/
└── docker-compose.yml
```

## Environment Variables
```env
# Database
POSTGRES_USER=postgres
POSTGRES_PASSWORD=securepassword
POSTGRES_DB=miseventos

# Backend
DATABASE_URL=postgresql://postgres:securepassword@postgres:5432/miseventos
SECRET_KEY=your-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# Frontend
REACT_APP_API_URL=http://localhost:8000/api/v1
```

## Troubleshooting

### Common Issues
```bash
# Reset everything
docker-compose down -v
docker-compose up --build

# View logs
docker-compose logs -f [service_name]

# Restart specific service
docker-compose restart backend
```
