import { APP_CONSTS } from 'src/utils/consts';
import DatabaseConnection from './DatabaseConnection';
import mysql, { Connection } from 'mysql2/promise';

export default class MySqlAdapter implements DatabaseConnection {
  connection!: Connection;

  // Make sure you connect the adapter before you query the database!
  async connect(): Promise<void> {
    this.connection = await mysql.createConnection({
      host: APP_CONSTS.DATABASE_HOST,
      user: APP_CONSTS.DATABASE_USER,
      password: APP_CONSTS.DATABASE_PASSWORD,
      database: APP_CONSTS.DATABASE_NAME,
    });
  }

  async query(statement: string, params?: Array<string | number | null>): Promise<any> {
    return this.connection.execute(statement, params);
  }

  async close(): Promise<void> {
    this.connection.end();
  }
}
