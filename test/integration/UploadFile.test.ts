import GetFileInformationUseCase from 'src/application/usecase/GetFileInformationUseCase';
import UploadFileUseCase from 'src/application/usecase/UploadFileUseCase';
import { APP_CONSTS } from 'src/utils/consts';
import LinkBuilderLocalGateway from 'src/infra/gateway/LinkBuilderLocalGateway';
import FileMemoryRepository from 'src/infra/repository/FileMemoryRepository';

const baseURL = `${APP_CONSTS.BASE_URL}:${APP_CONSTS.PORT}`;

it('should upload the file', async () => {
  const fileName = 'my-notes.txt';
  const path = '/documents';
  const userId = '1';

  const fileRepository = new FileMemoryRepository();
  const linkBuilderGateway = new LinkBuilderLocalGateway();

  const uploadFile = new UploadFileUseCase(fileRepository, linkBuilderGateway);
  const outputOne = await uploadFile.execute({ fileName, path, userId });

  const id = outputOne.id;
  const getFileInformation = new GetFileInformationUseCase(fileRepository, linkBuilderGateway);
  const outputTwo = await getFileInformation.execute({ id });

  expect(outputTwo.id).toBe(id);
  expect(outputTwo.fileName).toBe(fileName);
  expect(outputTwo.path).toBe(path);
  expect(outputTwo.downloadUrl).toBe(`${baseURL}/upload-content/${id}`);
});
