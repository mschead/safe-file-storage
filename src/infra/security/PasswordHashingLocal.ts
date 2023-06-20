import PasswordHashing from 'src/application/security/PasswordHashing';

export default class PasswordHashingLocal implements PasswordHashing {
  private SUFFIX = 'HASH';

  hash(password: string): Promise<string> {
    return Promise.resolve(password + this.SUFFIX);
  }
  compare(password: string, hashedPassword: string): Promise<boolean> {
    return Promise.resolve(password + this.SUFFIX === hashedPassword);
  }
}
