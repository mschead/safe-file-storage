import FileRepository from 'src/application/repository/FileRepository';
import FileInfo from 'src/domain/FileInfo';
import DatabaseConnection from 'src/infra/database/DatabaseConnection';

export default class FileDatabaseRepository implements FileRepository {
  constructor(readonly connection: DatabaseConnection) {}

  async getById(id: string): Promise<FileInfo> {
    const [rows] = await this.connection.query('SELECT * FROM files WHERE id = ?', [id]);
    const [result] = rows;
    return {
      id: result.id,
      fileName: result.name,
      path: result.path,
      userId: result.user_id,
    };
  }

  async getByPath(path: string): Promise<FileInfo[]> {
    const [rows] = await this.connection.query('SELECT * FROM files WHERE path = ?', [path]);
    const result = rows.map((r: any) => ({
      id: r.id,
      fileName: r.name,
      path: r.path,
    }));
    return result;
  }

  async save(fileInfo: FileInfo): Promise<string> {
    const [result] = await this.connection.query(
      'INSERT INTO files (name, path, user_id) VALUES (?, ?, ?)',
      [fileInfo.fileName, fileInfo.path, fileInfo.userId],
    );
    return result.insertId;
  }
}
