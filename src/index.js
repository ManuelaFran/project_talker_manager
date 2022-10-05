const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const bodyParser = require('body-parser');
const generateToken = require('./utils/generateToken');
const validateEmail = require('./middlewares/validateEmail');
const validatePassword = require('./middlewares/validatePassword');

const app = express();
app.use(express.json());
app.use(bodyParser.json());

const HTTP_OK_STATUS = 200;
const PORT = '3000';

const pathTalker = path.resolve(__dirname, '..', 'src', 'talker.json');

app.get('/talker', async (_req, res) => {
  const speakingPeople = JSON.parse(await fs.readFile(pathTalker, 'utf8'));
  res.status(HTTP_OK_STATUS).json(speakingPeople);
  if (!speakingPeople) {
    return res.status(HTTP_OK_STATUS).send([]);
  }
});

app.get('/talker/:id', async (req, res) => {
  const speakingPeople = JSON.parse(await fs.readFile(pathTalker, 'utf8'));
  const index = speakingPeople.find(({ id }) => id === Number(req.params.id));
  if (index) {
    return res.status(HTTP_OK_STATUS).json(index);
  }
  return res.status(404).json({ message: 'Pessoa palestrante não encontrada' });
});

app.post('/login', validateEmail, validatePassword, async (req, res, next) => {
  const { email, password } = req.body;
  if ([email, password].includes(undefined)) {
    next();
  }
  const token = generateToken();
  return res.status(HTTP_OK_STATUS).json({ token });
});

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

app.listen(PORT, () => {
  console.log('Online');
});
