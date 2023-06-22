import LinkBuilderGateway from 'src/application/gateway/LinkBuilderGateway';
import FileRepository from 'src/application/repository/FileRepository';
import FileInfo from 'src/domain/FileInfo';

export default class UploadFileUseCase {
  constructor(
    readonly fileRepository: FileRepository,
    readonly linkBuilderGateway: LinkBuilderGateway,
  ) {}

  async execute(input: Input): Promise<Output> {
    const fileInfo = new FileInfo(input.fileName, input.path, input.userId);
    const id = await this.fileRepository.save(fileInfo);
    const downloadUrl = await this.linkBuilderGateway.generateLink(id);

    return {
      id,
      downloadUrl,
    };
  }
}

interface Input {
  fileName: string;
  path: string;
  userId: string;
}

interface Output {
  id: string;
  downloadUrl: string;
}
