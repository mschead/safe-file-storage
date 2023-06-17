import FileRepository from 'src/application/repository/FileRepository';
import FileInfo from 'src/domain/FileInfo';

type ID = string;

export default class FileMemoryRepository implements FileRepository {
  private FILES: Record<ID, FileInfo> = {};

  getById(id: string): Promise<FileInfo> {
    const fileInfo = this.FILES[id];
    if (!fileInfo) throw new Error("File doesn't exist!");
    return Promise.resolve(fileInfo);
  }

  getByPath(path: string): Promise<FileInfo[]> {
    const allFilesInfo = Object.values(this.FILES);
    const filesByPath = allFilesInfo.filter((f) => f.path.includes(path));
    return Promise.resolve(filesByPath);
  }

  save(fileInfo: FileInfo): Promise<string> {
    const nextId = Object.values(this.FILES).length + 1;
    this.FILES[nextId] = {
      ...fileInfo,
      id: nextId.toString(),
    };
    return Promise.resolve(nextId.toString());
  }

  clear(): Promise<void> {
    this.FILES = {};
    return Promise.resolve();
  }
}
