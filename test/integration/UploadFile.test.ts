import GetFileInformationUseCase from 'src/application/usecase/GetFileInformationUseCase';
import UploadFileUseCase from 'src/application/usecase/UploadFileUseCase';
import LinkBuilderLocalGateway from 'src/infra/gateway/LinkBuilderLocalGateway';
import FileMemoryRepository from 'src/infra/repository/FileMemoryRepository';

const BASE_URL = 'http://localhost:4000';

it('should upload the file', async () => {
  const fileName = 'my-notes.txt';
  const path = '/documents';

  const fileRepository = new FileMemoryRepository();
  const linkBuilderGateway = new LinkBuilderLocalGateway();

  const uploadFile = new UploadFileUseCase(fileRepository, linkBuilderGateway);
  const outputOne = await uploadFile.execute({ fileName, path });

  const id = outputOne.id;
  const getFileInformation = new GetFileInformationUseCase(fileRepository, linkBuilderGateway);
  const outputTwo = await getFileInformation.execute({ id });

  expect(outputTwo.id).toBe(id);
  expect(outputTwo.fileName).toBe(fileName);
  expect(outputTwo.path).toBe(path);
  expect(outputTwo.downloadUrl).toBe(`${BASE_URL}/upload-content/${id}`);
});
