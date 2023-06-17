import GetFileInformationUseCase from 'src/application/usecase/GetFileInformationUseCase';
import FileInfo from 'src/domain/FileInfo';
import LinkBuilderLocalGateway from 'src/infra/gateway/LinkBuilderLocalGateway';
import FileMemoryRepository from 'src/infra/repository/FileMemoryRepository';

const BASE_URL = 'http://localhost:4000';

it('should get the file information', async () => {
  const fileName = 'my-notes.txt';
  const path = '/documents';

  const fileRepository = new FileMemoryRepository();
  const id = await fileRepository.save(new FileInfo(fileName, '/documents'));

  const linkBuilderGateway = new LinkBuilderLocalGateway();
  await linkBuilderGateway.generateLink(id);

  const getFileInformation = new GetFileInformationUseCase(fileRepository, linkBuilderGateway);
  const output = await getFileInformation.execute({ id });

  expect(output.id).toBe(id);
  expect(output.fileName).toBe(fileName);
  expect(output.path).toBe(path);
  expect(output.downloadUrl).toBe(`${BASE_URL}/upload-content/${id}`);
});
