const fs = require('fs').promises;

const pathTalker = './src/talker.json';
const readFileTalker = async () => {
  const readJson = await fs.readFile(pathTalker, 'utf-8');
  const data = await JSON.parse(readJson);
  return data;
};

const writeFileTalker = async (element) => {
  const data = await readFileTalker();

  const lastId = data.at(-1).id;
  const id = lastId + 1;
  const updateElement = { id, ...element };
  const updateData = [...data, updateElement];

  await fs.writeFile(pathTalker, JSON.stringify(updateData));

  return updateElement;
};

module.exports = { readFileTalker, writeFileTalker };