from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# --- Importación de configuraciones y routers ---
from app.core.config import settings
from app.routers import auth, events, registrations, users

# --- Creación de la instancia principal de la aplicación ---
app = FastAPI(
    title=settings.PROJECT_NAME,
    debug=settings.DEBUG,
    openapi_url=f"{settings.API_V1_STR}/openapi.json" if settings.is_development else None
)

# Configuración de CORS
origins = [
    "http://localhost",
    "http://localhost:3000",
    "http://localhost:3001",  # Por si cambias el puerto
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allow_headers=["*"],
)

# Incluir routers
app.include_router(auth.router, prefix=settings.API_V1_STR)
app.include_router(users.router, prefix=settings.API_V1_STR)
app.include_router(events.router, prefix=settings.API_V1_STR)
app.include_router(registrations.router, prefix=settings.API_V1_STR)

@app.get("/")
def read_root():
    return {
        "message": "API running!",
        "environment": settings.ENVIRONMENT,
        "debug": settings.DEBUG
    }

@app.get("/health")
def health_check():
    return {"status": "healthy", "environment": settings.ENVIRONMENT}