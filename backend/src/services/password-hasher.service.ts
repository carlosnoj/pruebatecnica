import {genSalt, hash, compare} from 'bcryptjs';

export class PasswordHasher {
  private readonly rounds = 10; // número de rondas para el hash

  async hashPassword(password: string): Promise<string> {
    const salt = await genSalt(this.rounds);
    return hash(password, salt);
  }

  async comparePassword(
    providedPass: string,
    storedPass: string,
  ): Promise<boolean> {
    return compare(providedPass, storedPass);
  }
}
