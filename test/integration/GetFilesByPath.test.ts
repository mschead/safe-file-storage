import GetFilesByPathUseCase from 'src/application/usecase/GetFilesByPathUseCase';
import FileInfo from 'src/domain/FileInfo';
import FileMemoryRepository from 'src/infra/repository/FileMemoryRepository';

it('should get the files by path', async () => {
  const fileRepository = new FileMemoryRepository();
  await fileRepository.save(new FileInfo('notes-1.txt', '/documents', '1'));
  await fileRepository.save(new FileInfo('notes-2.txt', '/documents', '1'));
  await fileRepository.save(new FileInfo('notes-3.txt', '/', '1'));
  await fileRepository.save(new FileInfo('notes-4.txt', '/images', '1'));

  const getFilesByPathUseCase = new GetFilesByPathUseCase(fileRepository);
  const output = await getFilesByPathUseCase.execute({ path: '/documents' });

  const [first, second] = output;
  expect(first).toMatchObject({ id: '1', path: '/documents', fileName: 'notes-1.txt' });
  expect(second).toMatchObject({ id: '2', path: '/documents', fileName: 'notes-2.txt' });
});

it('should get an empty array', async () => {
  const fileRepository = new FileMemoryRepository();
  await fileRepository.save(new FileInfo('notes-1.txt', '/documents', '1'));

  const getFilesByPathUseCase = new GetFilesByPathUseCase(fileRepository);
  const output = await getFilesByPathUseCase.execute({ path: '/images' });

  expect(output.length).toBe(0);
});
