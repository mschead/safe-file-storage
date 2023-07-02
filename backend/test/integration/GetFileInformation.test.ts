import GetFileInformationUseCase from 'src/application/usecase/GetFileInformationUseCase';
import { APP_CONSTS } from 'src/utils/consts';
import FileInfo from 'src/domain/FileInfo';
import LinkBuilderLocalGateway from 'src/infra/gateway/LinkBuilderLocalGateway';
import FileMemoryRepository from 'src/infra/repository/FileMemoryRepository';

const baseURL = `${APP_CONSTS.BASE_URL}:${APP_CONSTS.PORT}`;

it('should get the file information', async () => {
  const fileName = 'my-notes.txt';
  const path = '/documents';

  const fileRepository = new FileMemoryRepository();
  const id = await fileRepository.save(new FileInfo(fileName, '/documents', '1'));

  const linkBuilderGateway = new LinkBuilderLocalGateway();
  await linkBuilderGateway.generateLink(id);

  const getFileInformation = new GetFileInformationUseCase(fileRepository, linkBuilderGateway);
  const output = await getFileInformation.execute({ id });

  expect(output.id).toBe(id);
  expect(output.fileName).toBe(fileName);
  expect(output.path).toBe(path);
  expect(output.downloadUrl).toBe(`${baseURL}/upload-content/${id}`);
});
