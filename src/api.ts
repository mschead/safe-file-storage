import fs from 'fs';
import express, { Request, Response } from 'express';
import FileMemoryRepository from 'src/infra/repository/FileMemoryRepository';
import LinkBuilderLocalGateway from 'src/infra/gateway/LinkBuilderLocalGateway';
import GetFileInformationUseCase from 'src/application/usecase/GetFileInformationUseCase';
import { middlewareUpload } from 'src/middleware/multer';
import UploadFileUseCase from 'src/application/usecase/UploadFileUseCase';
import GetFilesByPathUseCase from 'src/application/usecase/GetFilesByPathUseCase';
import cors from 'cors';

const app = express();
app.use(express.json());
app.use(cors());

const fileRepository = new FileMemoryRepository();
const linkBuilderGateway = new LinkBuilderLocalGateway();
const uploadFile = new UploadFileUseCase(fileRepository, linkBuilderGateway);
const getFileInformation = new GetFileInformationUseCase(fileRepository, linkBuilderGateway);
const getFilesByPath = new GetFilesByPathUseCase(fileRepository);

app.get('/', async function (request: Request, response: Response) {
  response.send('Hello World!');
});

app.post('/file', async function (req: Request, res: Response) {
  const output = await uploadFile.execute({ fileName: req.body.fileName, path: req.body.path });
  res.json({ id: output.id, downloadUrl: output.downloadUrl });
});

app.post(
  '/upload-content/:id',
  (req, res, next) => {
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

app.get('/file/:id', async function (req: Request, res: Response) {
  const id = req.params.id;
  const output = await getFileInformation.execute({ id });
  res.json(output);
});

app.get(
  '/upload-content/:id',
  (req, res, next) => {
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

app.get('/files', async function (req: Request, res: Response) {
  const filePath = req.query.path;
  if (!filePath) throw new Error("Path doesn't exist");
  const output = await getFilesByPath.execute({ path: filePath.toString() });
  res.json(output);
});

app.listen(4000, () => {
  console.log('Listening ...');
});
