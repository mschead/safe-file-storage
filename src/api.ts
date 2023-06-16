import fs from 'fs';
import express, { Request, Response } from 'express';
import { FILES } from './filesStore';
import { middlewareIdCheck } from './middleware/middlewareIdChecker';
import { middlewareUpload } from './middleware/multer';

const app = express();
app.use(express.json());

app.get('/', async function (request: Request, response: Response) {
  response.send('Hello World!');
});

app.post('/file', async function (req: Request, res: Response) {
  const id = 'STATIC_ID';
  const downloadUrl = `http://localhost:4000/upload-content/${id}`;

  FILES[id] = {
    id,
    fileName: req.body.fileName,
    path: req.body.path,
    downloadUrl,
  };
  res.json({ id, downloadUrl });
});

app.post(
  '/upload-content/:id',
  middlewareIdCheck,
  middlewareUpload.single('content'),
  async function (req: Request, res: Response) {
    res.end();
  },
);

app.get('/file/:id', async function (req: Request, res: Response) {
  const id = req.params.id;
  const output = FILES[id];
  if (!output) {
    res.status(500).send("File doesn't exist");
  }
  res.json(output);
});

app.get('/upload-content/:id', middlewareIdCheck, async function (req: Request, res: Response) {
  const file = fs.createReadStream(`uploads/${req.params.id}`);
  const fileName = FILES[req.params.id];
  res.setHeader('Content-Disposition', 'attachment: filename="' + fileName + '"');
  file.pipe(res);
});

app.listen(4000, () => {
  console.log('Listening ...');
});
