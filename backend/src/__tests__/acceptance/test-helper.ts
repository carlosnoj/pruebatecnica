import {PruebatecnicaApplication} from '../..';
import {
  createRestAppClient,
  givenHttpServerConfig,
  Client,
} from '@loopback/testlab';

export async function setupApplication(
  preStartBind?: (app: PruebatecnicaApplication) => void,
): Promise<AppWithClient> {
  const restConfig = givenHttpServerConfig({});

  const app = new PruebatecnicaApplication({
    rest: restConfig,
  });

  // Boot para que los componentes y controllers estén listos
  await app.boot();

  // Permite que el test haga binds antes de start (ej. mock TokenService)
  if (typeof preStartBind === 'function') {
    preStartBind(app);
  }

  // Ahora arrancamos la app (escuchando)
  await app.start();

  const client = createRestAppClient(app);

  return {app, client};
}

export interface AppWithClient {
  app: PruebatecnicaApplication;
  client: Client;
}
