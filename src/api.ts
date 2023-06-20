import fs from 'fs';
import express, { Request, Response, NextFunction } from 'express';
import FileMemoryRepository from 'src/infra/repository/FileMemoryRepository';
import LinkBuilderLocalGateway from 'src/infra/gateway/LinkBuilderLocalGateway';
import GetFileInformationUseCase from 'src/application/usecase/GetFileInformationUseCase';
import { middlewareUpload } from 'src/infra/middleware/multer';
import UploadFileUseCase from 'src/application/usecase/UploadFileUseCase';
import GetFilesByPathUseCase from 'src/application/usecase/GetFilesByPathUseCase';
import cors from 'cors';
import SignInUserCase from 'src/application/usecase/SignInUserCase';
import UserMemoryRepository from 'src/infra/repository/UserMemoryRepository';
import LogInUseCase from 'src/application/usecase/LogInUseCase';
import PasswordHashingLocal from 'src/infra/security/PasswordHashingLocal';
import JwtTokenMemory from 'src/infra/security/JwtTokenMemory';
import VerifyUserExpress from 'src/infra/middleware/VerifyUserExpress';

const app = express();
app.use(express.json());
app.use(cors());

const fileRepository = new FileMemoryRepository();
const userRepository = new UserMemoryRepository();
const linkBuilderGateway = new LinkBuilderLocalGateway();
const passwordHashing = new PasswordHashingLocal();
const jwtToken = new JwtTokenMemory();

const verifyUserExpress = new VerifyUserExpress(jwtToken);

const uploadFile = new UploadFileUseCase(fileRepository, linkBuilderGateway);
const getFileInformation = new GetFileInformationUseCase(fileRepository, linkBuilderGateway);
const getFilesByPath = new GetFilesByPathUseCase(fileRepository);
const signInUseCase = new SignInUserCase(userRepository, passwordHashing);
const logInUseCase = new LogInUseCase(userRepository, passwordHashing, jwtToken);

app.get('/', async function (request: Request, response: Response) {
  response.send('Hello World!');
});

app.post('/file', verifyUserExpress.verify, async function (req: Request, res: Response) {
  const output = await uploadFile.execute({ fileName: req.body.fileName, path: req.body.path });
  res.json({ id: output.id, downloadUrl: output.downloadUrl });
});

app.post(
  '/upload-content/:id',
  (req: Request, res: Response, next: NextFunction) => {
    const fileInfo = fileRepository.getById(req.params.id);
    if (!fileInfo) {
      res.status(500);
      return;
    }
    next();
  },
  middlewareUpload.single('content'),
  async function (req: Request, res: Response) {
    res.end();
  },
);

app.get('/file/:id', verifyUserExpress.verify, async function (req: Request, res: Response) {
  const id = req.params.id;
  const output = await getFileInformation.execute({ id });
  res.json(output);
});

app.get(
  '/upload-content/:id',
  (req: Request, res: Response, next: NextFunction) => {
    const fileInfo = fileRepository.getById(req.params.id);
    if (!fileInfo) {
      res.status(500);
      return;
    }
    next();
  },
  async function (req: Request, res: Response) {
    const fileStream = fs.createReadStream(`uploads/${req.params.id}`);
    const fileInfo = await fileRepository.getById(req.params.id);
    res.setHeader('Content-Disposition', 'attachment; filename="' + fileInfo.fileName + '"');
    fileStream.pipe(res);
  },
);

app.get('/files', verifyUserExpress.verify, async function (req: Request, res: Response) {
  const filePath = req.query.path;
  if (!filePath) throw new Error("Path doesn't exist");
  const output = await getFilesByPath.execute({ path: filePath.toString() });
  res.json(output);
});

app.post(
  '/user/sign-in',
  async function (req: Request<{}, {}, { username: string; password: string }>, res: Response) {
    const { username, password } = req.body;
    if (!username || !password) throw new Error('Missing Credentials!');
    await signInUseCase.execute({ username, password });
    res.end();
  },
);

app.get('/user/log-in', async function (req: Request, res: Response) {
  const { username, password } = req.query;
  if (!username || !password) throw new Error('Wrong Credentials!');
  const output = await logInUseCase.execute({
    username: username.toString(),
    password: password.toString(),
  });
  res.json(output);
});

app.listen(4000, () => {
  console.log('Listening ...');
});
