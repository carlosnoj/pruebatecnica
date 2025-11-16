import {post, requestBody, get, param, HttpErrors} from '@loopback/rest';
import {AuthService} from '../services/auth.service';
import {service} from '@loopback/core';
import {repository} from '@loopback/repository';
import {UsuarioRepository} from '../repositories';

export class LoginController {
  constructor(
    @service(AuthService)
    public authService: AuthService,
    @repository(UsuarioRepository)
    public usuarioRepo: UsuarioRepository,
  ) {}

  @post('/usuarios/login', {
    responses: {
      '200': {
        description: 'Inicio de sesión',
        content: {'application/json': {schema: {}}},
      },
    },
  })
  async login(
    @requestBody({
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              correo: {type: 'string'},
              usuario: {type: 'string'},
              password: {type: 'string'},
            },
            required: ['password'],
          },
        },
      },
    })
    creds: {
      correo?: string;
      usuario?: string;
      password: string;
    },
  ) {
    const identifier = creds.correo;
    console.log('creds: ' + creds);
    console.log('correo ' + creds.correo);
    //console.log('usuario ' + creds.usuario);
    if (!identifier) {
      console.log('error al identificar el usuario ' + identifier?.toString);
      throw new HttpErrors.BadRequest('Debe enviar usuario o correo');
    }
    return this.authService.login(identifier, creds.password);
  }

  @get('/usuarios/me', {
    responses: {
      '200': {
        description: 'Usuario autenticado',
      },
    },
  })
  async getProfile(@param.header.string('authorization') authHeader: string) {
    if (!authHeader)
      throw new HttpErrors.Unauthorized('Token no proporcionado');

    const token = authHeader.replace('Bearer ', '');
    const data = await this.authService.verifyToken(token);
    const usuario = await this.usuarioRepo.findById(data.id_usuario);
    return usuario;
  }
}
