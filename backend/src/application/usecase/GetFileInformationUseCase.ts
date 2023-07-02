import LinkBuilderGateway from 'src/application/gateway/LinkBuilderGateway';
import FileRepository from 'src/application/repository/FileRepository';

export default class GetFileInformationUseCase {
  constructor(
    readonly fileRepository: FileRepository,
    readonly linkBuilderGateway: LinkBuilderGateway,
  ) {}

  async execute(input: Input): Promise<Output> {
    const fileInfo = await this.fileRepository.getById(input.id);
    const downloadUrl = await this.linkBuilderGateway.generateLink(fileInfo.id);
    return {
      id: fileInfo.id,
      fileName: fileInfo.fileName,
      path: fileInfo.path,
      downloadUrl: downloadUrl,
    };
  }
}

interface Input {
  id: string;
}

interface Output {
  id: string;
  fileName: string;
  path: string;
  downloadUrl: string;
}
