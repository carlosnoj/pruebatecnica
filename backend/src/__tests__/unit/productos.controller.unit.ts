import {
  expect,
  createStubInstance,
  StubbedInstanceWithSinonAccessor,
} from '@loopback/testlab';
import {ProductosController} from '../../controllers/productos.controller';
import {ProductoRepository} from '../../repositories';
import {Request} from '@loopback/rest';
import {Producto} from '../../models';
import jwt from 'jsonwebtoken';
import {SinonStub} from 'sinon';

// 1. Define un Producto de prueba
const mockProducto: Partial<Producto> = {
  nombre: 'Laptop',
  precio: 1200,
  stock: 10,
  id_categoria: 'cat-1',
};

// 2. Mock del Repositorio
let productoRepoStub: StubbedInstanceWithSinonAccessor<ProductoRepository>;
let createStub: SinonStub;
let findStub: SinonStub;

// 3. Mock del Request para simular headers
const mockRequest = (tokenValue: string | null): Request => {
  const req = {} as Request;
  if (tokenValue) {
    req.headers = {authorization: `Bearer ${tokenValue}`};
  } else {
    req.headers = {};
  }
  return req;
};

// 4. Mock del token JWT decodificado
const MOCK_USER_ID = 'user-123';
const MOCK_TOKEN = jwt.sign({id_usuario: MOCK_USER_ID}, 'SECRET', {
  expiresIn: '1h',
}); // Un token real o simulado

// Continuación de src/__tests__/unit/productos.controller.unit.ts

describe('ProductosController (Unit)', () => {
  let controller: ProductosController;

  beforeEach(() => {
    // Inicializa los Stubs del Repositorio
    productoRepoStub = createStubInstance(ProductoRepository);
    createStub = productoRepoStub.stubs.create;
    findStub = productoRepoStub.stubs.find;
  });

  describe('POST /productos (create)', () => {
    it('debería crear un producto si el usuario está autenticado', async () => {
      // Configura el Controller con un Request con token
      controller = new ProductosController(
        productoRepoStub as ProductoRepository,
        mockRequest(MOCK_TOKEN),
      );

      // Configura el stub para devolver un objeto creado
      createStub.resolves({
        ...mockProducto,
        id_producto: 'prod-1',
        id_usuario: MOCK_USER_ID,
        f_creacion: new Date().toISOString(),
      });

      const productoACrear = {
        nombre: 'Teclado',
        precio: 50,
        stock: 5,
        id_categoria: 'cat-2',
      };

      await controller.create(productoACrear as any);

      // Aserción 1: Verifica que se llamó a `create` con los datos correctos
      expect(
        createStub.calledWithMatch({
          ...productoACrear,
          id_usuario: MOCK_USER_ID,
        }),
      ).to.be.true();

      // Aserción 2: Verifica que el campo f_creacion fue inyectado
      const createdData = createStub.getCall(0).args[0];
      expect(createdData.f_creacion).to.be.a.String();
    });

    it('debería fallar si no hay token (usuario no autenticado)', async () => {
      // Configura el Controller sin token
      controller = new ProductosController(
        productoRepoStub as ProductoRepository,
        mockRequest(null),
      );

      // Espera que el método lance un error
      await expect(controller.create(mockProducto as any)).to.be.rejectedWith(
        'Usuario no autenticado',
      );

      // Aserción 3: Verifica que el repositorio NO fue llamado
      expect(createStub.called).to.be.false();
    });
  });

  // ... Puedes agregar tests similares para el método find
  describe('GET /productos (find)', () => {
    it('debería buscar productos filtrados por el id_usuario autenticado', async () => {
      controller = new ProductosController(
        productoRepoStub as ProductoRepository,
        mockRequest(MOCK_TOKEN),
      );

      const mockResult: Producto[] = [
        {
          id_producto: 'p1',
          ...mockProducto,
          id_usuario: MOCK_USER_ID,
        } as Producto,
      ];
      findStub.resolves(mockResult);

      await controller.find({limit: 10});

      // Verifica que el filtro enviado al repositorio incluya el id_usuario
      const filterArg = findStub.getCall(0).args[0];

      expect(filterArg.where).to.deepEqual({
        id_usuario: MOCK_USER_ID,
      });

      // Verifica que el filtro original también se mantuvo (limit: 10)
      expect(filterArg.limit).to.equal(10);
    });
  });
});
