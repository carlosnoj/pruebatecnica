import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getModelSchemaRef,
  patch,
  put,
  del,
  requestBody,
  response,
  HttpErrors,
} from '@loopback/rest';
import {Usuario, Rol} from '../models';
import {UsuarioRepository, RolRepository} from '../repositories';
import {PasswordHasher} from '../services/password-hasher.service';

export class UsuariosController {
  constructor(
    @repository(UsuarioRepository)
    public usuarioRepository: UsuarioRepository,
    @repository(RolRepository)
    public rolRepository: RolRepository,
  ) {}

  @get('/usuarios')
  @response(200, {
    description: 'Lista de usuarios con su respectivo rol',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id_usuario: {type: 'string'},
              usuario: {type: 'string'},
              nombre: {type: 'string'},
              correo: {type: 'string'},
              f_registro: {type: 'string'},
              nombre_rol: {type: 'string'},
              descripcion_rol: {type: 'string'},
            },
          },
        },
      },
    },
  })
  async listarConRol(): Promise<any[]> {
    try {
      const usuarios = await this.usuarioRepository.find();
      const roles = await this.rolRepository.find();

      const resultado = usuarios.map(u => {
        const rol = roles.find(r => r.id_rol === String(u.id_rol));

        return {
          id_usuario: u.id_usuario,
          usuario: u.usuario,
          nombre: u.nombre,
          correo: u.correo,
          f_registro: u.f_registro,
          nombre_rol: rol ? rol.nombre_rol : 'Sin rol asignado',
          descripcion_rol: rol ? rol.descripcion : '',
        };
      });
      return resultado;
    } catch (error) {
      console.error('Error en listarConRol:', error);
      throw error;
    }
  }

  @post('/usuarios')
  @response(200, {
    description: 'Usuario model instance',
    content: {'application/json': {schema: getModelSchemaRef(Usuario)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Usuario, {
            title: 'NewUsuario',
            exclude: ['id_usuario', 'f_registro'],
          }),
        },
      },
    })
    usuario: Omit<Usuario, 'id_usuario' | 'f_registro'>,
  ): Promise<Usuario> {
    const passwordHasher = new PasswordHasher();
    //Verificar si el nombre de usuario ya existe
    const existingUser = await this.usuarioRepository.findOne({
      where: {usuario: usuario.usuario},
    });
    if (existingUser) {
      throw new HttpErrors.Conflict('El nombre de usuario ya esta en uso.');
    }
    //Verificar si el correo ya está registrado
    const existingEmail = await this.usuarioRepository.findOne({
      where: {correo: usuario.correo},
    });
    if (existingEmail) {
      throw new HttpErrors.Conflict(
        'El correo electrónico ya está registrado.',
      );
    }
    // Cifrar la contraseña antes de guardar
    usuario.password = await passwordHasher.hashPassword(usuario.password);

    //quito el id_usuario del objeto
    const {id_usuario, ...usuarioSinId} = usuario as any;
    console.log('usuario sin id', usuarioSinId);
    //agregar fecha
    const nuevoUsuario = {
      ...usuarioSinId,
      f_registro: new Date().toISOString(),
    };
    console.log('nuevo usuario', nuevoUsuario);
    // Guardar el usuario con la contraseña cifrada
    return this.usuarioRepository.create(nuevoUsuario);
  }

  @get('/usuarios/count')
  @response(200, {
    description: 'Usuario model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(@param.where(Usuario) where?: Where<Usuario>): Promise<Count> {
    return this.usuarioRepository.count(where);
  }

  // @get('/usuarios')
  // @response(200, {
  //   description: 'Array of Usuario model instances',
  //   content: {
  //     'application/json': {
  //       schema: {
  //         type: 'array',
  //         items: getModelSchemaRef(Usuario, {includeRelations: true}),
  //       },
  //     },
  //   },
  // })
  // async find(
  //   @param.filter(Usuario) filter?: Filter<Usuario>,
  // ): Promise<Usuario[]> {
  //   return this.usuarioRepository.find(filter);
  // }

  @patch('/usuarios')
  @response(200, {
    description: 'Usuario PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Usuario, {partial: true}),
        },
      },
    })
    usuario: Usuario,
    @param.where(Usuario) where?: Where<Usuario>,
  ): Promise<Count> {
    return this.usuarioRepository.updateAll(usuario, where);
  }

  @get('/usuarios/{id}')
  @response(200, {
    description: 'Usuario model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Usuario, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Usuario, {exclude: 'where'})
    filter?: FilterExcludingWhere<Usuario>,
  ): Promise<Usuario> {
    return this.usuarioRepository.findById(id, filter);
  }

  @patch('/usuarios/{id}')
  @response(204, {
    description: 'Usuario PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Usuario, {partial: true}),
        },
      },
    })
    usuario: Usuario,
  ): Promise<void> {
    //quito algunas propiedades como el password y f_registro
    const {password, f_registro, ...usuarioMod} = usuario;
    console.log('usuario sin propiedades', usuarioMod);
    await this.usuarioRepository.updateById(id, usuarioMod);
  }

  @put('/usuarios/{id}')
  @response(204, {
    description: 'Usuario PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() usuario: Usuario,
  ): Promise<void> {
    await this.usuarioRepository.replaceById(id, usuario);
  }

  @del('/usuarios/{id}')
  @response(204, {
    description: 'Usuario DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.usuarioRepository.deleteById(id);
  }
}
