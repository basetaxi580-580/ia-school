---
type: note
project: IA School
topic: deploy
status: active
created: 2026-10-22
---

# Deploy IA School

## Estado
- Stack local independiente.
- Docker Compose orquesta backend, frontend y MongoDB.

## Puertos locales
- Frontend: `http://localhost:4202`
- Backend: `http://localhost:8082`
- Health: `http://localhost:8082/actuator/health`

## Comandos
```bash
docker compose up --build
```

## Verificación
- Backend responde `UP`.
- Frontend carga la UI.
- API devuelve la lista de estudiantes.
