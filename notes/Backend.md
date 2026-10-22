---
type: note
project: IA School
topic: backend
status: draft
created: 2026-10-22
---

# Backend IA School

## Stack
- Spring Boot 3.4.2
- Java 21
- MongoDB
- Actuator

## API
- `GET /api/students`
- `GET /api/students/{id}`
- `GET /api/students/summary`
- `POST /api/students`
- `PUT /api/students/{id}`
- `DELETE /api/students/{id}`
- `GET /actuator/health`

## Modelo principal
- `Student`

## Seed inicial
- Se cargan 4 estudiantes al arrancar si la colección está vacía.

## Comandos
```bash
cd backend
mvn -q -DskipTests package
```
