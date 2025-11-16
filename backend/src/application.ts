import {BootMixin} from '@loopback/boot';
import {ApplicationConfig} from '@loopback/core';
import {
  RestExplorerBindings,
  RestExplorerComponent,
} from '@loopback/rest-explorer';
import {RepositoryMixin} from '@loopback/repository';
import {RestApplication} from '@loopback/rest';
import {ServiceMixin} from '@loopback/service-proxy';
import {AuthenticationComponent} from '@loopback/authentication';
import {JWTAuthenticationComponent} from '@loopback/authentication-jwt';
import path from 'path';
import {MySequence} from './sequence';

export {ApplicationConfig};

export class PruebatecnicaApplication extends BootMixin(
  ServiceMixin(RepositoryMixin(RestApplication)),
) {
  constructor(options: ApplicationConfig = {}) {
    // Configurar CORS: permite localhost para desarrollo y el dominio de producción
    // const allowedOrigins = process.env.ALLOWED_ORIGINS
    //   ? process.env.ALLOWED_ORIGINS.split(',')
    //   : ['http://localhost:8080', 'http://localhost:8081'];
    const {JWTStrategy} = require('./authentication-strategies/jwt-strategy');

    options = {
      rest: {
        ...options.rest,
        cors: {
          origin: [
            'http://localhost:8080',
            'https://pruebatecnica-frontend-ulco.onrender.com', // Tu URL de frontend
          ],
          methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
          allowedHeaders: ['Content-Type', 'Authorization'],
          credentials: true,
        },
      },
    };

    super(options);

    // Set up the custom sequence
    this.sequence(MySequence);

    // Mount authentication system
    this.component(AuthenticationComponent);
    // Mount jwt component
    this.component(JWTAuthenticationComponent);

    // Set up default home page
    this.static('/', path.join(__dirname, '../public'));

    // Customize @loopback/rest-explorer configuration here
    this.configure(RestExplorerBindings.COMPONENT).to({
      path: '/explorer',
    });
    this.component(RestExplorerComponent);

    this.projectRoot = __dirname;
    // Customize @loopback/boot Booter Conventions here
    this.bootOptions = {
      controllers: {
        // Customize ControllerBooter Conventions here
        dirs: ['controllers'],
        extensions: ['.controller.js'],
        nested: true,
      },
    };
  }
}
