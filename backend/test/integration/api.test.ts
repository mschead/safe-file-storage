import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';
import { APP_CONSTS } from 'src/utils/consts';
import MySqlAdapter from 'src/infra/database/MySqlAdapter';

const baseURL = `${APP_CONSTS.BASE_URL}:${APP_CONSTS.PORT}`;
const api = axios.create({ baseURL });

let headers = { Authorization: '' };
let connection = new MySqlAdapter();

beforeAll(async () => {
  fs.mkdirSync('uploads');
  fs.writeFileSync('uploads/test-file.txt', 'This is just a random information.');
  await connection.connect();
  await connection.query('DELETE FROM files;');
  await connection.query('DELETE FROM users;');
  const userPayload = {
    username: 'UserX',
    password: 'password123',
  };
  await api.post('/user/sign-in', userPayload);
  const loginRes = await api.get('/user/log-in', { params: userPayload });
  headers.Authorization = loginRes.data.token;
});

afterAll(async () => {
  await connection.query('DELETE FROM files;');
  await connection.query('DELETE FROM users;');
  await connection.close();
  fs.rmSync('uploads', { recursive: true, force: true });
});

it('should upload the file properly', async () => {
  const payload = {
    fileName: 'test-file.txt',
    path: '/documents',
  };
  const resOne = await api.post('/file', payload, { headers });
  const outputOne = resOne.data;

  const expectedFileContent = 'This is just a random information.';
  const formData = new FormData();
  const formDataStream = fs.createReadStream('uploads/test-file.txt');
  formData.append('content', formDataStream);
  await api.post(outputOne.downloadUrl, formData);

  const resTwo = await api.get(`/file/${outputOne.id}`, { headers });
  const outputTwo = resTwo.data;
  expect(outputTwo).toMatchObject({
    id: outputOne.id,
    fileName: payload.fileName,
    path: payload.path,
    downloadUrl: outputOne.downloadUrl,
  });

  const resThree = await api.get(`/upload-content/${outputOne.id}`, { headers });
  const outputThree = resThree.data;
  expect(expectedFileContent).toBe(outputThree);

  fs.unlinkSync(`uploads/${outputOne.id}`);
});

it('should get the files by path', async () => {
  const payload = {
    fileName: 'test-file.txt',
    path: '/images',
  };
  const resOne = await api.post('/file', payload, { headers });
  const outputOne = resOne.data;

  const formData = new FormData();
  const formDataStream = fs.createReadStream('uploads/test-file.txt');
  formData.append('content', formDataStream);
  await axios.post(outputOne.downloadUrl, formData);

  const resTwo = await api.get('/files', { params: { path: '/images' }, headers });
  const [fileInfo] = resTwo.data;

  expect(fileInfo).toMatchObject({
    id: outputOne.id,
    fileName: payload.fileName,
    path: payload.path,
  });

  fs.unlinkSync(`uploads/${outputOne.id}`);
});

it('should create an user', async () => {
  const payload = {
    username: 'Marcos',
    password: 'admin123',
  };
  await api.post('/user/sign-in', payload);

  const resTwo = await api.get('/user/log-in', { params: payload });
  const outputTwo = resTwo.data;

  expect(outputTwo.token).toBeDefined();
});
