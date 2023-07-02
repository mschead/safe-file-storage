import UserRepository from 'src/application/repository/UserRepository';
import JwtToken from 'src/application/security/JwtToken';
import PasswordHashing from 'src/application/security/PasswordHashing';

export default class LogInUseCase {
  constructor(
    readonly userRepository: UserRepository,
    readonly passwordHashing: PasswordHashing,
    readonly jwtToken: JwtToken,
  ) {}

  async execute(input: Input): Promise<Output> {
    const user = await this.userRepository.getByUserName(input.username);
    const userHashedPassword = user.hashedPassword;
    const isPasswordCorrect = await this.passwordHashing.compare(
      input.password,
      userHashedPassword,
    );
    if (!isPasswordCorrect) {
      throw new Error('Wrong password!');
    }

    const signedToken = await this.jwtToken.signAccessToken(user.id);
    return Promise.resolve({
      token: signedToken.token,
    });
  }
}

interface Input {
  username: string;
  password: string;
}

interface Output {
  token: string;
}
