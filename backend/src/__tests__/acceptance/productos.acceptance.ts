import {Client, expect} from '@loopback/testlab';
import {PruebatecnicaApplication} from '../../application';
import {setupApplication} from './test-helper';
import {TokenServiceBindings} from '@loopback/authentication-jwt';
import {securityId} from '@loopback/security';

describe('ProductosController (acceptance)', () => {
  let app: PruebatecnicaApplication;
  let client: Client;

  /**
   * Mock TokenService para los tests
   */
  class MockTokenService {
    async verifyToken(token: string) {
      if (token === 'valid-token') {
        return {
          [securityId]: 'user-123',
          id: 'user-123',
          name: 'Usuario de Prueba',
        };
      }

      const err: any = new Error('Token inválido');
      err.statusCode = 401;
      throw err;
    }

    async generateToken(userProfile: any): Promise<string> {
      return 'mock-token';
    }
  }

  beforeEach(async () => {
    // PASAMOS un callback para bind antes de iniciar la app
    ({app, client} = await setupApplication(appInstance => {
      appInstance
        .bind(TokenServiceBindings.TOKEN_SERVICE)
        .toClass(MockTokenService);
    }));
  });

  afterEach(async () => {
    await app.stop();
  });

  it('POST /productos requiere autenticación', async () => {
    const res = await client.post('/productos').send({
      nombre: 'test',
      precio: 10,
      stock: 1,
      id_categoria: 'cat1',
    });

    expect(res.status).to.equal(401);
  });

  it('POST /productos crea un producto con token válido', async () => {
    const res = await client
      .post('/productos')
      .set('Authorization', 'Bearer valid-token')
      .send({
        nombre: 'Producto test',
        precio: 100,
        stock: 5,
        id_categoria: 'cat1',
      });

    expect(res.status).to.equal(200);
    expect(res.body).to.have.property('id_producto');
    expect(res.body.id_usuario).to.equal('user-123');
  });
});
