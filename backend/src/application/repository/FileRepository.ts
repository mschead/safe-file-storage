import FileInfo from 'src/domain/FileInfo';

export default interface FileRepository {
  getById(id: string): Promise<FileInfo>;
  getByPath(path: string): Promise<Array<FileInfo>>;
  save(fileInfo: FileInfo): Promise<string>;
}
