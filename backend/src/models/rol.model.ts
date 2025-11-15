import {Entity, model, property} from '@loopback/repository';

@model()
export class Rol extends Entity {
  @property({
    type: 'string',
    id: true,
  })
  id_rol: string;

  @property({
    type: 'string',
    required: true,
  })
  nombre_rol: string;

  @property({
    type: 'string',
  })
  descripcion?: string;

  constructor(data?: Partial<Rol>) {
    super(data);
  }
}

export interface RolRelations {
  // describe navigational properties here
}

export type RolWithRelations = Rol & RolRelations;
