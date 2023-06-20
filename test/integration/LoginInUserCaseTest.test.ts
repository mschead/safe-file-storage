import LogInUseCase from 'src/application/usecase/LogInUseCase';
import SignInUserCase from 'src/application/usecase/SignInUserCase';
import UserMemoryRepository from 'src/infra/repository/UserMemoryRepository';
import JwtTokenMemory from 'src/infra/security/JwtTokenMemory';
import PasswordHashingLocal from 'src/infra/security/PasswordHashingLocal';

it('should login the user in with success', async () => {
  const userRepository = new UserMemoryRepository();
  const passwordHashing = new PasswordHashingLocal();
  const jwtToken = new JwtTokenMemory();
  const username = 'marcos.schead';
  const password = 'admin123';

  const signInUserCase = new SignInUserCase(userRepository, passwordHashing);
  await signInUserCase.execute({ username, password });

  const logInUseCase = new LogInUseCase(userRepository, passwordHashing, jwtToken);
  const outputTwo = await logInUseCase.execute({ username, password });

  expect(outputTwo.token).toBe('1_TOKEN');
});

it('should not login the user with a wrong password', async () => {
  const userRepository = new UserMemoryRepository();
  const passwordHashing = new PasswordHashingLocal();
  const jwtToken = new JwtTokenMemory();
  const username = 'marcos.schead';
  const password = 'admin123';

  const signInUserCase = new SignInUserCase(userRepository, passwordHashing);
  await signInUserCase.execute({ username, password });

  const logInUseCase = new LogInUseCase(userRepository, passwordHashing, jwtToken);
  const callExecute = async () => {
    await logInUseCase.execute({ username, password: 'admin' });
  };

  await expect(callExecute()).rejects.toThrowError('Wrong password!');
});
