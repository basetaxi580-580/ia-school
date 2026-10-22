# IA School

CRUD independiente para estudiantes con Spring Boot, React y MongoDB.

## Estructura
- `backend/` API Spring Boot
- `frontend/` React + Vite
- `docker-compose.yml` orquestación local

## Puertos locales
- Frontend: `http://localhost:4202`
- Backend: `http://localhost:8082`
- Backend health: `http://localhost:8082/actuator/health`

## Levantar
```bash
docker compose up --build
```

## CRUD
Entidad principal: `Student`
- alta
- edición
- eliminación
- búsqueda y filtros
- resumen conectado al backend
