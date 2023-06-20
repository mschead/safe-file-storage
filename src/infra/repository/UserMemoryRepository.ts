import UserRepository from 'src/application/repository/UserRepository';
import User from 'src/domain/User';

type ID = string;

interface UserMemory {
  id: string;
  userName: string;
  hashedPassword: string;
}

export default class UserMemoryRepository implements UserRepository {
  private USERS: Record<ID, UserMemory> = {};

  create(userName: string, hashedPassword: string): Promise<void> {
    const nextId = Object.values(this.USERS).length + 1;
    this.USERS[nextId] = {
      id: nextId.toString(),
      userName,
      hashedPassword,
    };
    return Promise.resolve();
  }

  getByUserName(userName: string): Promise<User> {
    const users = Object.values(this.USERS);
    const user = users.find((u) => u.userName === userName);
    if (!user) throw new Error('User not found!');
    return Promise.resolve(user);
  }
}
