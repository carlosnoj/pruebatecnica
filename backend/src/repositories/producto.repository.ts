import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MongodsDataSource} from '../datasources';
import {Producto, ProductoRelations} from '../models';

export class ProductoRepository extends DefaultCrudRepository<
  Producto,
  typeof Producto.prototype.id_producto,
  ProductoRelations
> {
  constructor(@inject('datasources.mongods') dataSource: MongodsDataSource) {
    super(Producto, dataSource);
  }
}
