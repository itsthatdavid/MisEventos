# MisEventos - Event Management Platform

React + FastAPI + PostgreSQL

## Setup

```bash
# Clone and configure
git clone <repository-url>
cd MisEventos
cp .env.example .env

# Start services
docker-compose up -d --build
```

## Access Points

- Frontend: http://localhost:3000
- Backend API: http://localhost:8000/docs
- Database: `docker-compose exec postgres psql -U ${POSTGRES_USER} -d ${POSTGRES_DB}`

## Common Commands

```bash
# Restart services
docker-compose down && docker-compose up -d

# Rebuild after changes
docker-compose build --no-cache && docker-compose up -d

# Reset database
docker-compose down -v && docker-compose up --build
```

## Database Migrations

```bash
# Create migration
docker-compose exec backend poetry run alembic revision --autogenerate -m "description"

# Apply migrations
docker-compose exec backend poetry run alembic upgrade head
```

## Testing

```bash
# Backend tests
docker-compose exec backend poetry run pytest

# Frontend tests
docker-compose exec frontend npm test
```

## Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
```

## Environment Variables

Configure in `.env`:
- `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB`
- `DATABASE_URL`, `SECRET_KEY`
- `REACT_APP_API_URL`