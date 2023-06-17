import fs from 'fs';
import express, { Request, Response } from 'express';
import FileMemoryRepository from 'src/infra/repository/FileMemoryRepository';
import LinkBuilderLocalGateway from 'src/infra/gateway/LinkBuilderLocalGateway';
import GetFileInformationUseCase from 'src/application/usecase/GetFileInformationUseCase';
import { middlewareUpload } from 'src/middleware/multer';
import UploadFileUseCase from 'src/application/usecase/UploadFileUseCase';

const app = express();
app.use(express.json());

const fileRepository = new FileMemoryRepository();
const linkBuilderGateway = new LinkBuilderLocalGateway();
const uploadFile = new UploadFileUseCase(fileRepository, linkBuilderGateway);
const getFileInformation = new GetFileInformationUseCase(fileRepository, linkBuilderGateway);

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
    res.setHeader('Content-Disposition', 'attachment: fileId="' + req.params.id + '"');
    fileStream.pipe(res);
  },
);

app.listen(4000, () => {
  console.log('Listening ...');
});
