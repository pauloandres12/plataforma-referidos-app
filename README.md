# Plataforma de Referidos y Fidelización

Proyecto de Ingeniería Web para la Cooperativa de Ahorro y Crédito Padre Julián Lorente.

Integrantes: Javier Viñán, Paulo Bustamante.

## Tecnologías

- Frontend: React con Vite
- Backend: Node.js con Express
- Base de datos: MySQL (MAMP)
- Seguridad: bcrypt, JWT en cookie httpOnly, helmet

## Requisitos

- Node.js (versión LTS)
- MAMP con MySQL encendido (puerto 8889, usuario root, contraseña root)

## Cómo ejecutarlo en local

### 1. Base de datos

1. Abre phpMyAdmin (MAMP > WebStart > Tools > phpMyAdmin).
2. Entra a la pestaña SQL.
3. Pega el contenido de `database/schema.sql` y presiona Go.

### 2. Backend

```bash
cd backend
npm install
cp .env.example .env
```

Abre el archivo `.env` y reemplaza `JWT_SECRET` por un texto aleatorio. Puedes generarlo con:

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

Luego inicia el servidor:

```bash
npm run dev
```

Debe aparecer `Servidor corriendo en http://localhost:3000`.

### 3. Frontend

En otra terminal:

```bash
cd frontend
npm install
npm run dev
```

Abre http://localhost:5173

## Notas

- El archivo `backend/.env` no se sube a GitHub porque contiene secretos.
- Las cuentas nuevas quedan en estado `pendiente`. Mientras no exista el panel de administrador, se activan desde phpMyAdmin cambiando `estado` a `activa`.