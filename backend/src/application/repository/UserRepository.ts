import User from 'src/domain/User';

export default interface UserRepository {
  create(userName: string, hashedPassword: string): Promise<void>;
  getByUserName(userName: string): Promise<User>;
}
