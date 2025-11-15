import {inject, lifeCycleObserver, LifeCycleObserver} from '@loopback/core';
import {juggler} from '@loopback/repository';

// Si hay MONGO_URL en las variables de entorno, úsala directamente
// Si no, usa la configuración por defecto (localhost)
const mongoUrl = process.env.MONGO_URL;

const config = mongoUrl
  ? {
      name: 'mongods',
      connector: 'mongodb',
      url: mongoUrl,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  : {
      name: 'mongods',
      connector: 'mongodb',
      url: '',
      host: process.env.MONGO_HOST || 'localhost',
      port: parseInt(process.env.MONGO_PORT || '27017', 10),
      user: process.env.MONGO_USER || '',
      password: process.env.MONGO_PASSWORD || '',
      database: process.env.MONGO_DATABASE || 'pruebatecnicadb',
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
