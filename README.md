# README DEL PROYECTO

Requerimientos:
Docker y Docker Compose
Postman (Opcional)
Instalar Node.js
Instalar npm
WSL o Git Bash si usas Windows

# Setup
docker-compose up -d --build

# Restarting (Once images are already downloaded)
docker-compose down
docker-compose build --no-cache
docker-compose up

# Checking if all is running correctly
Frontend - http://localhost:3000
Backend - http://localhost:8000/docs
Database - docker-compose exec postgres psql -U miseventos_user -d miseventos_db -c "SELECT version();"

# Clean database restart
docker-compose down -v
docker-compose up --build

# Notas
Se usa un único .env para todo el proyecto para mayor simplicidad y orden