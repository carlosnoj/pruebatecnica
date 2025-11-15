# Guía de Despliegue en la Nube

Esta guía te ayudará a desplegar tu aplicación en la nube usando servicios gratuitos.

## 🎯 Opción Recomendada: Render

**Render** es la opción más fácil y tiene un plan gratuito generoso:
- ✅ 750 horas gratis/mes (suficiente para 1 servicio 24/7)
- ✅ MongoDB gratis con MongoDB Atlas
- ✅ Soporte para Docker
- ✅ HTTPS automático
- ✅ Despliegue automático desde GitHub

### Paso a Paso: Desplegar en Render

#### 1. Preparar MongoDB Atlas (Base de Datos Gratuita)

1. **Crear cuenta en MongoDB Atlas:**
   - Ve a https://www.mongodb.com/cloud/atlas/register
   - Regístrate con tu email (gratis)

2. **Crear un cluster gratuito:**
   - Selecciona "Free" (M0)
   - Elige una región cercana (ej: `us-east-1`)
   - Crea el cluster (tarda ~3 minutos)

3. **Configurar acceso:**
   - Ve a "Network Access" → "Add IP Address"
   - Selecciona "Allow Access from Anywhere" (0.0.0.0/0) para desarrollo
   - Ve a "Database Access" → "Add New Database User"
   - Crea un usuario y contraseña (guárdalos)

4. **Obtener la cadena de conexión:**
   - Ve a "Database" → "Connect" → "Connect your application"
   - Copia la cadena de conexión (ej: `mongodb+srv://user:password@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority`)
   - Reemplaza `<password>` con tu contraseña
   - Reemplaza `<dbname>` con `pruebatecnicadb`

#### 2. Preparar el Código para Producción

##### 2.1 Crear archivo `.env.example` en el backend:

```bash
MONGO_URL=mongodb+srv://user:password@cluster0.xxxxx.mongodb.net/pruebatecnicadb?retryWrites=true&w=majority
JWT_SECRET=tu_secret_key_super_segura_aqui_cambiala
NODE_ENV=production
PORT=3000
```

##### 2.2 Actualizar el backend para usar variables de entorno:

Asegúrate de que `backend/src/datasources/mongods.datasource.ts` use `process.env.MONGO_URL`

##### 2.3 Crear `render.yaml` en la raíz del proyecto:

```yaml
services:
  - type: web
    name: pruebatecnica-backend
    env: node
    buildCommand: cd backend && npm install && npm run build
    startCommand: cd backend && npm start
    envVars:
      - key: NODE_ENV
        value: production
      - key: PORT
        value: 3000
      - key: MONGO_URL
        sync: false  # Lo configurarás manualmente
      - key: JWT_SECRET
        sync: false  # Lo configurarás manualmente
```

#### 3. Subir el Código a GitHub

1. **Inicializar Git (si no lo has hecho):**
```bash
cd /Users/carlosnoj/Desktop/PruebaTecnica/pruebatecnica
git init
git add .
git commit -m "Initial commit"
```

2. **Crear repositorio en GitHub:**
   - Ve a https://github.com/new
   - Crea un repositorio (ej: `pruebatecnica`)
   - **NO** inicialices con README

3. **Conectar y subir:**
```bash
git remote add origin https://github.com/TU_USUARIO/pruebatecnica.git
git branch -M main
git push -u origin main
```

#### 4. Desplegar en Render

1. **Crear cuenta en Render:**
   - Ve a https://render.com
   - Regístrate con GitHub (más fácil)

2. **Crear nuevo Web Service:**
   - Dashboard → "New" → "Web Service"
   - Conecta tu repositorio de GitHub
   - Selecciona el repositorio `pruebatecnica`

3. **Configurar el servicio:**
   - **Name:** `pruebatecnica-backend`
   - **Environment:** `Node`
   - **Region:** Elige la más cercana
   - **Branch:** `main`
   - **Root Directory:** `backend`
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm start`

4. **Configurar Variables de Entorno:**
   - En "Environment Variables", agrega:
     - `MONGO_URL`: Tu cadena de conexión de MongoDB Atlas
     - `JWT_SECRET`: Una clave secreta segura (genera una aleatoria)
     - `NODE_ENV`: `production`
     - `PORT`: `3000` (Render lo asigna automáticamente, pero por si acaso)

5. **Desplegar:**
   - Click en "Create Web Service"
   - Render comenzará a construir y desplegar
   - Espera ~5-10 minutos
   - Obtendrás una URL como: `https://pruebatecnica-backend.onrender.com`

#### 5. Desplegar el Frontend

1. **Crear Static Site en Render:**
   - Dashboard → "New" → "Static Site"
   - Conecta el mismo repositorio

2. **Configurar:**
   - **Name:** `pruebatecnica-frontend`
   - **Root Directory:** `frontend/catalogo-app`
   - **Build Command:** `npm install && npm run build`
   - **Publish Directory:** `dist`

3. **Variables de Entorno:**
   - Necesitarás actualizar la URL del backend en el frontend
   - Crea un archivo `.env.production` en `frontend/catalogo-app/`:
   ```
   VUE_APP_API_URL=https://pruebatecnica-backend.onrender.com
   ```

4. **Actualizar el servicio API en el frontend:**
   - Edita `frontend/catalogo-app/src/services/api.js`
   - Asegúrate de que use `process.env.VUE_APP_API_URL` o la variable de entorno

#### 6. Configurar CORS en el Backend

Asegúrate de que `backend/src/application.ts` tenga configurado CORS para tu dominio de frontend:

```typescript
cors: {
  origin: [
    'http://localhost:8080',
    'https://pruebatecnica-frontend.onrender.com' // Tu URL de frontend
  ],
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}
```

---

## 🔄 Alternativa 1: Railway

**Railway** es otra excelente opción gratuita:

### Ventajas:
- ✅ $5 gratis al mes
- ✅ Muy fácil de usar
- ✅ Soporta Docker
- ✅ MongoDB incluido

### Pasos:

1. **Regístrate:** https://railway.app
2. **Nuevo Proyecto** → "Deploy from GitHub repo"
3. **Agrega MongoDB:**
   - "New" → "Database" → "Add MongoDB"
4. **Despliega Backend:**
   - "New" → "GitHub Repo"
   - Selecciona tu repo
   - Railway detecta automáticamente Node.js
   - Configura variables de entorno
5. **Despliega Frontend:**
   - Similar proceso para el frontend

---

## 🔄 Alternativa 2: Fly.io

**Fly.io** es bueno para aplicaciones Docker:

### Ventajas:
- ✅ Plan gratuito generoso
- ✅ Excelente para Docker
- ✅ Global edge network

### Pasos:

1. **Instala Fly CLI:**
```bash
curl -L https://fly.io/install.sh | sh
```

2. **Login:**
```bash
fly auth login
```

3. **Crea app:**
```bash
cd backend
fly launch
```

4. **Configura variables:**
```bash
fly secrets set MONGO_URL="tu_mongo_url"
fly secrets set JWT_SECRET="tu_secret"
```

---

## 🔄 Alternativa 3: Vercel (Solo Frontend) + Render (Backend)

**Vercel** es excelente para frontends estáticos:

### Para el Frontend:

1. **Regístrate:** https://vercel.com
2. **Import Project** desde GitHub
3. **Configuración:**
   - Framework Preset: Vue.js
   - Root Directory: `frontend/catalogo-app`
   - Build Command: `npm run build`
   - Output Directory: `dist`
4. **Variables de Entorno:**
   - `VUE_APP_API_URL`: URL de tu backend en Render

---

## 📝 Checklist Pre-Despliegue

Antes de desplegar, asegúrate de:

- [ ] ✅ Código subido a GitHub
- [ ] ✅ MongoDB Atlas configurado y funcionando
- [ ] ✅ Variables de entorno configuradas
- [ ] ✅ CORS configurado para producción
- [ ] ✅ `.env` no está en el repositorio (usar `.env.example`)
- [ ] ✅ `JWT_SECRET` es seguro y aleatorio
- [ ] ✅ Frontend apunta a la URL correcta del backend
- [ ] ✅ Tests pasando localmente

---

## 🐛 Troubleshooting

### Problema: "Cannot connect to MongoDB"

**Solución:**
- Verifica que la IP de Render esté en la whitelist de MongoDB Atlas
- Usa "Allow Access from Anywhere" (0.0.0.0/0) para desarrollo
- Verifica que la cadena de conexión tenga la contraseña correcta

### Problema: "CORS error"

**Solución:**
- Asegúrate de que el frontend esté en la lista de `origin` en CORS
- Verifica que `credentials: true` esté configurado

### Problema: "Build fails"

**Solución:**
- Verifica que `package.json` tenga el script `start`
- Asegúrate de que `build` compile correctamente
- Revisa los logs de build en Render

---

## 💰 Costos

### Render (Gratis):
- Web Service: 750 horas/mes gratis (suficiente para 1 servicio 24/7)
- MongoDB Atlas: Siempre gratis (M0 cluster)
- **Total: $0/mes**

### Si necesitas más:
- Render: $7/mes por servicio adicional
- MongoDB Atlas: $9/mes para M10 (más recursos)

---

## 🚀 Siguiente Paso: CI/CD

Una vez desplegado, puedes configurar:
- **Despliegue automático:** Cada push a `main` despliega automáticamente
- **Preview deployments:** Branches crean deployments de prueba
- **Health checks:** Monitoreo automático

---

## 📚 Recursos

- [Render Docs](https://render.com/docs)
- [MongoDB Atlas Docs](https://docs.atlas.mongodb.com/)
- [Railway Docs](https://docs.railway.app)
- [Fly.io Docs](https://fly.io/docs)

---

¡Buena suerte con tu despliegue! 🎉

