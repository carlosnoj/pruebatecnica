import {inject} from '@loopback/core';
import {AuthenticationStrategy} from '@loopback/authentication';
import {TokenServiceBindings} from '../keys';
import {UserProfile, securityId} from '@loopback/security';
import {HttpErrors, Request} from '@loopback/rest';
import {AuthService} from '../services/auth.service';

export class JWTStrategy implements AuthenticationStrategy {
  name = 'jwt';

  constructor(
    @inject('services.AuthService')
    public authService: AuthService,
  ) {}

  async authenticate(request: Request): Promise<UserProfile | undefined> {
    const token: string = this.extractCredentials(request);

    const decoded = await this.authService.verifyToken(token);

    // ⚠️ IMPORTANTE: construir UserProfile con securityId obligatorio
    const userProfile: UserProfile = {
      [securityId]: decoded.id_usuario, // 🔥 requerido
      id: decoded.id_usuario,
      name: decoded.usuario,
      rol: decoded.rol,
    };

    return userProfile;
  }

  extractCredentials(request: Request): string {
    if (!request.headers.authorization) {
      throw new HttpErrors.Unauthorized('No authorization header found.');
    }

    const authHeader = request.headers.authorization;

    if (!authHeader.startsWith('Bearer ')) {
      throw new HttpErrors.Unauthorized(
        `Authorization header is not of type Bearer.`,
      );
    }

    return authHeader.split(' ')[1];
  }
}
