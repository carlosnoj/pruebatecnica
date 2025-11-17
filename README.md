📦 Prueba Técnica – Frontend + Backend + Gateway.

Este proyecto consiste en una aplicación full-stack con:
*  Backend: LoopBack 4 + MongoDB Atlas
*  Frontend: Vue.js + Vuetify
*  Gateway/Proxy: Node.js
*  MongoDB: MongoDB Atlas o contenedor local
*  Docker: ejecución local con docker-compose

🚀 1. Requisitos previos
Asegúrate de tener instalados:
*  Node.js ≥ 18
*  NPM ≥ 8
*  Docker + Docker Compose
*  Cuenta en MongoDB Atlas

📁 2. Estructura del proyecto

<img width="220" height="258" alt="Captura de pantalla 2025-11-16 a la(s) 9 44 22 p m" src="https://github.com/user-attachments/assets/a9e85e0b-dd50-4571-bb3a-f536fa5d7f87" />

🔧 3. Configuración
3.1 Backend – Variables de entorno

Crear el archivo:
backend/.env

Con el siguiente contenido

*  MONGO_URL=mongodb+srv://<user>:<pass>@<cluster>.mongodb.net/pruebatecnicadb
*  JWT_SECRET=clave
*  PORT=3000

Si usas la base local por Docker:
MONGO_URL=mongodb://mongo:27017/pruebatecnicadb

3.2 Frontend – Variables de entorno

Crear:
*  frontend/.env

Con:
VUE_APP_API_URL=http://localhost:3000

🐳 4. Ejecutar el proyecto con Docker
En la carpeta raíz:
docker-compose up --build

Para apagarlos:
docker-compose down

🖥️ 5. Correr el Backend localmente

Instalar dependencias
*  cd backend
*  npm install

Ejecutar en modo dev:
*  npm run start

Backend se levantara en:
*  http://localhost:3000
*  Swagger/Explorer: http://localhost:3000/explorer

🖥️ 6. Correr el Frontend localmente
*  cd frontend
*  npm install
*  npm run serve

Frontend se levantara:
*  http://localhost:8080

🚀 Despliegue en Render

Backend
*  Crear servicio Web
*  Seleccionar carpeta backend/
*  Build Command: npm install && npm run build
*  Start Command: npm start
*  Agregar variables de entorno:
   *  MONGO_URL
   *  JWT_SECRET

Frontend
*  Crear servicio Static Site
*  Seleccionar carpeta frontend/
*  Buid Command: npm install && npm run build
*  Publish directory: dist
*  Configurar la url del backend en: frontend/src/services/api.js

🧪 Tests (Backend)
*  cd backend
*  npm test



