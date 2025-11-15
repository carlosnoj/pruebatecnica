import {Entity, model, property} from '@loopback/repository';

@model()
export class Categoria extends Entity {
  @property({
    type: 'string',
    id: true,
  })
  id_categoria: string;

  @property({
    type: 'string',
    required: true,
  })
  nombre_cat: string;

  @property({
    type: 'string',
    required: true,
  })
  descripcion: string;

  constructor(data?: Partial<Categoria>) {
    super(data);
  }
}

export interface CategoriaRelations {
  // describe navigational properties here
}

export type CategoriaWithRelations = Categoria & CategoriaRelations;
