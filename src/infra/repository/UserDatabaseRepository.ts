import UserRepository from 'src/application/repository/UserRepository';
import User from 'src/domain/User';
import DatabaseConnection from 'src/infra/database/DatabaseConnection';

export default class UserDatabaseRepository implements UserRepository {
  constructor(readonly connection: DatabaseConnection) {}

  async create(userName: string, hashedPassword: string): Promise<void> {
    await this.connection.query('INSERT INTO users (name, password) VALUES (?, ?)', [
      userName,
      hashedPassword,
    ]);
  }

  async getByUserName(userName: string): Promise<User> {
    const [rows] = await this.connection.query('SELECT * FROM users WHERE name = ?', [userName]);
    const [result] = rows;
    if (!result) throw new Error("User doesn't exist");
    return {
      id: result.id,
      userName: result.name,
      hashedPassword: result.password,
    };
  }
}
