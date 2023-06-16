import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';
import path from 'path';

const BASE_URL = 'http://localhost:4000';

it('should upload the file properly', async () => {
  const payload = {
    fileName: 'my-file.txt',
    path: '/documents',
  };
  const resOne = await axios.post(`${BASE_URL}/file`, payload);
  const outputOne = resOne.data;

  const expectedFileContent = 'This is just a random information.';
  const formData = new FormData();
  const formDataStream = fs.createReadStream(path.join(__dirname, '../uploads/', 'test.txt'));
  formData.append('content', formDataStream);
  await axios.post(outputOne.downloadUrl, formData);

  const resTwo = await axios.get(`${BASE_URL}/file/${outputOne.id}`);
  const outputTwo = resTwo.data;
  expect(outputTwo).toMatchObject({
    id: outputOne.id,
    fileName: payload.fileName,
    path: payload.path,
    downloadUrl: outputOne.downloadUrl,
  });

  const resThree = await axios.get(`${BASE_URL}/upload-content/${outputOne.id}`);
  const outputThree = resThree.data;
  expect(expectedFileContent).toBe(outputThree);

  fs.unlinkSync(path.join(__dirname, `../uploads/${outputOne.id}`));
});
