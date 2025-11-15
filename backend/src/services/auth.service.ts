import {injectable, BindingScope} from '@loopback/core';
import {repository} from '@loopback/repository';
import {UsuarioRepository} from '../repositories';
import {HttpErrors} from '@loopback/rest';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import {promisify} from 'util';
import {PasswordHasher} from './password-hasher.service';
import {RolRepository} from '../repositories';

const jwtSign = promisify(jwt.sign);
const jwtVerify = promisify(jwt.verify);

@injectable({scope: BindingScope.TRANSIENT})
export class AuthService {
  private jwtSecret: string = process.env.JWT_SECRET || 'supersecretkey';
  private jwtExpiresIn: string | number = '8h';

  constructor(
    @repository(UsuarioRepository)
    public usuarioRepository: UsuarioRepository,
    @repository(RolRepository)
    public rolRepository: RolRepository,
  ) {}

  async login(identifier: string, password: string) {
    const usuario = await this.usuarioRepository.findOne({
      where: {
        or: [{correo: identifier}, {usuario: identifier}],
      },
    });

    if (!usuario) {
      throw new HttpErrors.Unauthorized('Usuario o correo no encontrado');
    }

    const passwordHasher = new PasswordHasher();
    const passwordMatched = await passwordHasher.comparePassword(
      password,
      usuario.password,
    );

    if (!passwordMatched) {
      throw new HttpErrors.Unauthorized('Contraseña incorrecta');
    }
    /*
    const isMatch = await bcrypt.compare(password, usuario.password);
    if (!isMatch) {
      throw new HttpErrors.Unauthorized('Contraseña incorrecta');
    }
    */
    const role = await this.rolRepository.findOne({
      where: {
        id_rol: usuario.id_rol,
      },
    });
    if (!role) {
      throw new HttpErrors.Unauthorized('Rol no encontrado');
    }

    const payload = {
      id_usuario: usuario.id_usuario,
      correo: usuario.correo,
      usuario: usuario.usuario,
      rol: role.nombre_rol, //id_rol: usuario.id_rol
    };

    const token = await this.generateToken(payload);

    return {
      token,
      user: {
        id_usuario: usuario.id_usuario,
        usuario: usuario.usuario,
        nombre: usuario.nombre,
        correo: usuario.correo,
        rol: role.nombre_rol,
      },
    };
  }

  async generateToken(payload: any): Promise<string> {
    const signOptions: jwt.SignOptions = {expiresIn: 60 * 60 * 8};

    return new Promise((resolve, reject) => {
      jwt.sign(payload, this.jwtSecret, signOptions, (err, token) => {
        if (err || !token) return reject(err);
        resolve(token);
      });
    });
  }

  async verifyToken(token: string): Promise<jwt.JwtPayload> {
    try {
      const decoded = jwt.verify(token, this.jwtSecret);

      if (typeof decoded === 'string') {
        throw new HttpErrors.Unauthorized('Token invalido');
      }
      return decoded as jwt.JwtPayload;
    } catch {
      throw new HttpErrors.Unauthorized('Token inválido o expirado');
    }
  }
}
