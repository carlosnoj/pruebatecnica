import {BindingKey} from '@loopback/core';
import {TokenService} from '@loopback/authentication-jwt';

export namespace TokenServiceConstants {
  export const TOKEN_SECRET_VALUE = process.env.JWT_SECRET ?? 'supersecretkey';
  export const TOKEN_EXPIRES_IN_VALUE = '8h';
}

export namespace TokenServiceBindings {
  export const TOKEN_SECRET = BindingKey.create<string>(
    'authentication.jwt.secret',
  );
  export const TOKEN_EXPIRES_IN = BindingKey.create<string>(
    'authentication.jwt.expires.in',
  );
  export const TOKEN_SERVICE = BindingKey.create<TokenService>(
    'services.jwt.service',
  );
}
