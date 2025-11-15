import {expect} from '@loopback/testlab';
import {ProductoRepository} from '../../repositories';
import {juggler} from '@loopback/repository';

describe('ProductoRepository (unit)', () => {
  it('debe crearse correctamente con un datasource fake', () => {
    const ds = new juggler.DataSource({
      name: 'mongo_fake',
      connector: 'memory',
    });

    const repo = new ProductoRepository(ds as any);

    expect(repo).to.be.instanceOf(ProductoRepository);
  });
});
