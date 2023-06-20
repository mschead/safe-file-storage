import UserRepository from 'src/application/repository/UserRepository';
import PasswordHashing from 'src/application/security/PasswordHashing';

export default class SignInUserCase {
  constructor(readonly userRepository: UserRepository, readonly passwordHashing: PasswordHashing) {}

  async execute(input: Input): Promise<void> {
    const hashedPassword = await this.passwordHashing.hash(input.password);
    await this.userRepository.create(input.username, hashedPassword);
  }
}

interface Input {
  username: string;
  password: string;
}
