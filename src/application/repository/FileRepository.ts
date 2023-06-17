import FileInfo from 'src/domain/FileInfo';

export default interface FileRepository {
  getById(id: string): Promise<FileInfo>;
  save(fileInfo: FileInfo): Promise<string>;
}
