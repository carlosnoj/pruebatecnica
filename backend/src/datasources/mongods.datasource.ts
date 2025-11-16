import {inject, lifeCycleObserver, LifeCycleObserver} from '@loopback/core';
import {juggler} from '@loopback/repository';

// Usa MONGO_URL si está disponible, sino usa localhost por defecto
const mongoUrl =
  process.env.MONGO_URL ?? 'mongodb://localhost:27017/pruebatecnicadb';

// Log para debugging (mostrar URL sin contraseña)
const maskedUrl = mongoUrl.replace(/:[^:@]+@/, ':****@');
console.log('🔍 MONGO_URL detectada:', maskedUrl);
console.log(
  '🔍 Formato:',
  mongoUrl.startsWith('mongodb+srv://')
    ? '✅ mongodb+srv://'
    : '⚠️  mongodb://',
);

// Validar y corregir formato de URL si es necesario
const finalMongoUrl = mongoUrl;

// Si la URL usa mongodb:// pero parece ser MongoDB Atlas, advertir
if (
  finalMongoUrl.startsWith('mongodb://') &&
  finalMongoUrl.includes('mongodb.net')
) {
  console.warn(
    '⚠️  ADVERTENCIA: Parece que estás usando MongoDB Atlas pero con formato mongodb://',
  );
  console.warn('   Deberías usar mongodb+srv:// en lugar de mongodb://');
  console.warn('   URL actual:', finalMongoUrl.replace(/:[^:@]+@/, ':****@'));
}

// Log de la URL (sin mostrar contraseña) solo en desarrollo
if (process.env.NODE_ENV !== 'production') {
  const maskedUrl2 = finalMongoUrl.replace(/:[^:@]+@/, ':****@');
  console.log('📊 MongoDB URL:', maskedUrl2);
  console.log(
    '📊 Formato:',
    finalMongoUrl.startsWith('mongodb+srv://')
      ? '✅ mongodb+srv://'
      : '⚠️  mongodb://',
  );
}

const config = {
  name: 'mongods',
  connector: 'mongodb',
  url: finalMongoUrl,
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

// Observe application's life cycle to disconnect the datasource when
// application is stopped. This allows the application to be shut down
// gracefully. The `stop()` method is inherited from `juggler.DataSource`.
// Learn more at https://loopback.io/doc/en/lb4/Life-cycle.html
@lifeCycleObserver('datasource')
export class MongodsDataSource
  extends juggler.DataSource
  implements LifeCycleObserver
{
  static dataSourceName = 'mongods';
  static readonly defaultConfig = config;

  constructor(
    @inject('datasources.config.mongods', {optional: true})
    dsConfig: object = config,
  ) {
    super(dsConfig);
  }
}
