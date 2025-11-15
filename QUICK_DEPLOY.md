# 🚀 Despliegue Rápido - Resumen

## Opción Más Fácil: Render (Recomendado)

### 1. MongoDB Atlas (5 minutos)
1. Regístrate en https://www.mongodb.com/cloud/atlas/register
2. Crea cluster gratuito (M0)
3. Network Access → Allow from anywhere (0.0.0.0/0)
4. Database Access → Crea usuario
5. Connect → Copia la cadena de conexión

### 2. GitHub (2 minutos)
```bash
git init
git add .
git commit -m "Initial commit"
# Crea repo en GitHub
git remote add origin https://github.com/TU_USUARIO/pruebatecnica.git
git push -u origin main
```

### 3. Render Backend (5 minutos)
1. Ve a https://render.com → Sign up with GitHub
2. New → Web Service → Conecta tu repo
3. Configuración:
   - **Name:** `pruebatecnica-backend`
   - **Root Directory:** `backend`
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm start`
4. Environment Variables:
   - `MONGO_URL`: Tu cadena de MongoDB Atlas
   - `JWT_SECRET`: Clave aleatoria segura
   - `ALLOWED_ORIGINS`: `https://pruebatecnica-frontend.onrender.com`
5. Deploy → Espera 5-10 minutos
6. Obtén tu URL: `https://pruebatecnica-backend.onrender.com`

### 4. Render Frontend (5 minutos)
1. New → Static Site → Conecta tu repo
2. Configuración:
   - **Name:** `pruebatecnica-frontend`
   - **Root Directory:** `frontend/catalogo-app`
   - **Build Command:** `npm install && npm run build`
   - **Publish Directory:** `dist`
3. Environment Variables:
   - `VUE_APP_API_BASE_URL`: `https://pruebatecnica-backend.onrender.com`
4. Deploy → Espera 5 minutos
5. Obtén tu URL: `https://pruebatecnica-frontend.onrender.com`

### 5. Actualizar CORS en Backend
En Render, edita las variables de entorno del backend:
- `ALLOWED_ORIGINS`: `https://pruebatecnica-frontend.onrender.com`
- Redeploy

## ✅ ¡Listo!

Tu app estará en:
- Frontend: `https://pruebatecnica-frontend.onrender.com`
- Backend: `https://pruebatecnica-backend.onrender.com`

## 💰 Costo: $0/mes (Gratis)

- Render: 750 horas/mes gratis (suficiente para 1 servicio 24/7)
- MongoDB Atlas: Siempre gratis (M0 cluster)

---

**Nota:** La primera vez que Render "duerme" tu servicio (después de 15 min de inactividad), el siguiente request puede tardar ~30 segundos en despertar. Esto es normal en el plan gratis.

Para más detalles, ver [DEPLOY.md](./DEPLOY.md)

