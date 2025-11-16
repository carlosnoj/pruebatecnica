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
import {Producto} from '../models';
import {ProductoRepository} from '../repositories';
import {authenticate} from '@loopback/authentication';
import {SecurityBindings, UserProfile} from '@loopback/security';
import {Request, RestBindings} from '@loopback/rest';
import {inject} from '@loopback/core';
import jwt from 'jsonwebtoken';

export class ProductosController {
  constructor(
    @repository(ProductoRepository)
    public productoRepository: ProductoRepository,
    @inject(RestBindings.Http.REQUEST)
    private request: Request,
  ) {}

  private getUserIdFromToken(currentUser?: UserProfile): string | null {
    // Si tenemos el usuario del contexto de seguridad, usarlo
    if (currentUser) {
      return (
        currentUser.id ||
        (currentUser as {id_usuario?: string}).id_usuario ||
        null
      );
    }

    // Fallback: intentar obtener del header (para compatibilidad y tests unitarios)
    try {
      const authHeader = this.request.headers.authorization;
      if (!authHeader) return null;

      const token = authHeader.split(' ')[1];
      if (!token) return null;

      // Intentar decodificar el token (para tests unitarios que usan JWT real)
      const decoded = jwt.decode(token);
      if (decoded && typeof decoded === 'object' && 'id_usuario' in decoded) {
        return (decoded as {id_usuario: string}).id_usuario;
      }

      return null;
    } catch (err) {
      console.error('Error al obtener token:', err);
      return null;
    }
  }

  @authenticate('jwt')
  @post('/productos')
  @response(200, {
    description: 'Producto model instance',
    content: {'application/json': {schema: getModelSchemaRef(Producto)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Producto, {
            title: 'NewProducto',
            exclude: ['id_producto', 'f_creacion'],
          }),
        },
      },
    })
    producto: Omit<Producto, 'id_producto' | 'f_creacion'>,
    @inject(SecurityBindings.USER, {optional: true})
    currentUser?: UserProfile,
  ): Promise<Producto> {
    const userId = currentUser?.id || this.getUserIdFromToken(currentUser);
    console.log('usuario autenticado', userId);
    if (!userId) {
      throw new HttpErrors.Unauthorized('Usuario no autenticado');
    }
    const newProduct = {
      ...producto,
      id_usuario: userId,
      f_creacion: new Date().toISOString(),
    };
    return this.productoRepository.create(newProduct);
  }

  @get('/productos/count')
  @response(200, {
    description: 'Producto model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(@param.where(Producto) where?: Where<Producto>): Promise<Count> {
    return this.productoRepository.count(where);
  }

  @authenticate('jwt')
  @get('/productos')
  @response(200, {
    description: 'Array of Producto model instances by user',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Producto, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Producto) filter?: Filter<Producto>,
    @inject(SecurityBindings.USER, {optional: true})
    currentUser?: UserProfile,
  ): Promise<Producto[]> {
    const userId = currentUser?.id || this.getUserIdFromToken(currentUser);

    if (!userId) {
      throw new HttpErrors.Unauthorized('No hay usuario autenticado');
    }
    const where = {
      ...(filter?.where ?? {}),
      id_usuario: userId,
    };

    return this.productoRepository.find({...filter, where});
  }

  @patch('/productos')
  @response(200, {
    description: 'Producto PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Producto, {partial: true}),
        },
      },
    })
    producto: Producto,
    @param.where(Producto) where?: Where<Producto>,
  ): Promise<Count> {
    return this.productoRepository.updateAll(producto, where);
  }

  @get('/productos/{id}')
  @response(200, {
    description: 'Producto model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Producto, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Producto, {exclude: 'where'})
    filter?: FilterExcludingWhere<Producto>,
  ): Promise<Producto> {
    return this.productoRepository.findById(id, filter);
  }

  @patch('/productos/{id}')
  @response(204, {
    description: 'Producto PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Producto, {partial: true}),
        },
      },
    })
    producto: Producto,
  ): Promise<void> {
    await this.productoRepository.updateById(id, producto);
  }

  @put('/productos/{id}')
  @response(204, {
    description: 'Producto PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() producto: Producto,
  ): Promise<void> {
    await this.productoRepository.replaceById(id, producto);
  }

  @del('/productos/{id}')
  @response(204, {
    description: 'Producto DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.productoRepository.deleteById(id);
  }
}
