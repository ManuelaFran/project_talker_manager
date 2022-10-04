const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
app.use(express.json());
app.use(bodyParser.json());

const HTTP_OK_STATUS = 200;
const PORT = '3000';

const pathTalker = path.resolve(__dirname, '..', 'src', 'talker.json');

app.get('/talker', async (_req, res) => {
  const speakingPeople = JSON.parse(await fs.readFile(pathTalker, 'utf8'));
  res.status(200).json(speakingPeople);
  if (!speakingPeople) {
    return res.status(200).send([]);
  }
});

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

app.listen(PORT, () => {
  console.log('Online');
});
