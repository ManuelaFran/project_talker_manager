const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const bodyParser = require('body-parser');
const generateToken = require('./utils/generateToken');
const validateEmail = require('./middlewares/validateEmail');
const validatePassword = require('./middlewares/validatePassword');
const auth = require('./middlewares/auth');
const validateName = require('./middlewares/validateName');
const validateAge = require('./middlewares/validateAge');
const validateTalk = require('./middlewares/validateTalk');
const validateWatchedAt = require('./middlewares/validateWatchedAt');
const validateRate = require('./middlewares/validateRate');
const { writeFileTalker } = require('./utils/fs');

const app = express();
app.use(express.json());
app.use(bodyParser.json());

const HTTP_OK_STATUS = 200;
const PORT = '3000';

const pathTalker = path.resolve(__dirname, '..', 'src', 'talker.json');

// Requisito 1
app.get('/talker', async (_req, res) => {
  const speakingPeople = JSON.parse(await fs.readFile(pathTalker, 'utf8'));
  res.status(HTTP_OK_STATUS).json(speakingPeople);
  if (!speakingPeople) {
    return res.status(HTTP_OK_STATUS).send([]);
  }
});

// Requisito 8
app.get('/talker/search', auth, async (req, res) => {
  const { q } = req.query;
  const speakingPeople = JSON.parse(await fs.readFile(pathTalker, 'utf8'));
  if (!q) {
    return res.status(HTTP_OK_STATUS).json(speakingPeople);
  }
  const searchTalker = speakingPeople.filter((item) => item.name.includes(q));
  res.status(HTTP_OK_STATUS).json(searchTalker);
});

// Requisito 2
app.get('/talker/:id', async (req, res) => {
  const speakingPeople = JSON.parse(await fs.readFile(pathTalker, 'utf8'));
  const index = speakingPeople.find(({ id }) => id === Number(req.params.id));
  if (index) {
    return res.status(HTTP_OK_STATUS).json(index);
  }
  return res.status(404).json({ message: 'Pessoa palestrante não encontrada' });
});

// Requisitos 3 e 4
app.post('/login', validateEmail, validatePassword, (req, res, next) => {
  const { email, password } = req.body;
  if ([email, password].includes(undefined)) {
    next();
  }
  const token = generateToken();
  return res.status(HTTP_OK_STATUS).json({ token });
});

// Requisito 5
app.post('/talker', auth, validateName, validateAge, validateTalk,
validateWatchedAt, validateRate, async (req, res) => {
    const data = req.body;
    const newData = await writeFileTalker(data);
    res.status(201).json(newData);
});

// Requisito 6
app.put('/talker/:id', auth, validateName, validateAge, validateTalk, validateRate, 
validateWatchedAt, async (req, res) => {
  const { id } = req.params;
  const { name, age, talk } = req.body;
  const speakingPeople = JSON.parse(await fs.readFile(pathTalker, 'utf-8'));
  const addTalker = { name, age, talk };
  const idTalker = speakingPeople.find((indexTalker) => indexTalker.id === Number(id));
  if (!idTalker) {
    return res.status(400).send({ message: 'Person not found' });
  }
  Object.assign(idTalker, addTalker);
  await fs.writeFile(pathTalker, JSON.stringify(speakingPeople));
   return res.status(HTTP_OK_STATUS).json(idTalker);
});

// Requisito 7
app.delete('/talker/:id', auth, async (req, res) => {
  const id = Number(req.params.id);
  const speakingPeople = JSON.parse(await fs.readFile(pathTalker, 'utf-8'));
  const personId = speakingPeople.find((person) => person.id === id); 
  await fs.writeFile(pathTalker, JSON.stringify(personId));
  return res.status(204).end();
});

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

app.listen(PORT, () => {
  console.log('Online');
});
