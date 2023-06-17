import FileInfo from 'src/domain/FileInfo';

it('should create an FileInfo', async () => {
  const fileName = 'my-notes.txt';
  const path = '/documents';
  const id = '1';
  const fileInfo = new FileInfo(fileName, path, id);
  expect(fileInfo.fileName).toBe(fileName);
  expect(fileInfo.path).toBe(path);
  expect(fileInfo.id).toBe(id);
});

it('should throw an error for an empty fileName', async () => {
  const fileName = '';
  const path = '/documents';
  const id = '1';
  expect(() => new FileInfo(fileName, path, id)).toThrow('FileName should not be empty!');
});

it('should throw an error for an empty path', async () => {
  const fileName = 'my-notes.txt';
  const path = '';
  const id = '1';
  expect(() => new FileInfo(fileName, path, id)).toThrow('Path should not be empty!');
});
