import FileRepository from 'src/application/repository/FileRepository';

export default class GetFilesByPathUseCase {
  constructor(readonly fileRepository: FileRepository) {}

  async execute(input: Input): Promise<Output> {
    const filesInfo = await this.fileRepository.getByPath(input.path);
    const output: Output = filesInfo.map((f) => ({
      id: f.id,
      fileName: f.fileName,
      path: f.path,
    }));
    return output;
  }
}

interface Input {
  path: string;
}

type Output = Array<{
  id: string;
  fileName: string;
  path: string;
}>;
