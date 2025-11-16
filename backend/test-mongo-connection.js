/**
 * Script para probar la conexión a MongoDB
 * Uso: node test-mongo-connection.js
 * O con variables de entorno: MONGO_URL="tu_url" node test-mongo-connection.js
 */

const {MongoClient} = require('mongodb');

// Obtener la URL de MongoDB desde variables de entorno o argumentos
const mongoUrl = process.env.MONGO_URL || process.argv[2];

if (!mongoUrl) {
  console.error('❌ Error: No se proporcionó MONGO_URL');
  console.log('\nUso:');
  console.log('  node test-mongo-connection.js "mongodb+srv://user:password@cluster.mongodb.net/dbname"');
  console.log('  O: MONGO_URL="mongodb+srv://..." node test-mongo-connection.js');
  process.exit(1);
}

// Validar formato de URL
if (!mongoUrl.startsWith('mongodb://') && !mongoUrl.startsWith('mongodb+srv://')) {
  console.error('❌ Error: La URL debe comenzar con mongodb:// o mongodb+srv://');
  console.log('\nPara MongoDB Atlas, usa mongodb+srv://');
  process.exit(1);
}

// Si es mongodb:// pero parece ser Atlas (tiene múltiples hosts), sugerir mongodb+srv://
if (mongoUrl.startsWith('mongodb://') && mongoUrl.includes('mongodb.net')) {
  console.warn('⚠️  Advertencia: Parece que estás usando MongoDB Atlas.');
  console.warn('   Deberías usar mongodb+srv:// en lugar de mongodb://');
  console.warn('   Ejemplo: mongodb+srv://user:password@cluster.mongodb.net/dbname');
  console.log('');
}

console.log('🔄 Intentando conectar a MongoDB...');
console.log(`📍 URL: ${mongoUrl.replace(/:[^:@]+@/, ':****@')}`); // Ocultar contraseña
console.log('');

const client = new MongoClient(mongoUrl, {
  serverSelectionTimeoutMS: 5000, // Timeout de 5 segundos
});

async function testConnection() {
  try {
    console.log('⏳ Conectando...');
    await client.connect();
    console.log('✅ Conexión exitosa!');
    
    // Probar operaciones básicas
    const db = client.db();
    const adminDb = client.db().admin();
    
    // Listar bases de datos
    console.log('\n📊 Información de la conexión:');
    const dbList = await adminDb.listDatabases();
    console.log(`   Bases de datos disponibles: ${dbList.databases.length}`);
    dbList.databases.forEach(db => {
      console.log(`   - ${db.name} (${(db.sizeOnDisk / 1024 / 1024).toFixed(2)} MB)`);
    });
    
    // Probar ping
    const pingResult = await adminDb.ping();
    console.log('\n🏓 Ping result:', pingResult);
    
    // Probar una operación simple
    const collections = await db.listCollections().toArray();
    console.log(`\n📁 Colecciones en la base de datos actual: ${collections.length}`);
    collections.forEach(col => {
      console.log(`   - ${col.name}`);
    });
    
    console.log('\n✅ Todas las pruebas pasaron! La conexión funciona correctamente.');
    process.exit(0);
    
  } catch (error) {
    console.error('\n❌ Error al conectar:');
    console.error(`   Tipo: ${error.name}`);
    console.error(`   Mensaje: ${error.message}`);
    
    if (error.message.includes('authentication failed')) {
      console.error('\n💡 Posibles soluciones:');
      console.error('   1. Verifica que el usuario y contraseña sean correctos');
      console.error('   2. Asegúrate de que el usuario tenga permisos en la base de datos');
    } else if (error.message.includes('ENOTFOUND') || error.message.includes('getaddrinfo')) {
      console.error('\n💡 Posibles soluciones:');
      console.error('   1. Verifica que la URL del cluster sea correcta');
      console.error('   2. Verifica tu conexión a internet');
    } else if (error.message.includes('IP')) {
      console.error('\n💡 Posibles soluciones:');
      console.error('   1. Ve a MongoDB Atlas → Network Access');
      console.error('   2. Agrega la IP 0.0.0.0/0 (Allow from anywhere) para desarrollo');
    } else if (error.message.includes('SSL') || error.message.includes('TLS')) {
      console.error('\n💡 Posibles soluciones:');
      console.error('   1. Asegúrate de usar mongodb+srv:// para MongoDB Atlas');
      console.error('   2. Verifica que la URL incluya ?ssl=true o &ssl=true');
    }
    
    process.exit(1);
  } finally {
    await client.close();
    console.log('\n🔌 Conexión cerrada.');
  }
}

testConnection();

