import express, { Request, Response } from 'express';
const app = express();
app.use(express.json());

app.get('/', async function (request: Request, response: Response) {
  response.send('Hello World!');
});

app.listen(4000, () => {
  console.log('Listening ...');
});
