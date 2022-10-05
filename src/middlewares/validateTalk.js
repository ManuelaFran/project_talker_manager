const validateTalk = (talkValue, res, value) => {
  if (!talkValue) {
    return res.status(400).json({ message: `O campo ${value} é obrigatório` });
  }
};

module.exports = (req, res, next) => {
  const { talk } = req.body;

 // eslint-disable-next-line no-useless-escape
 return validateTalk(talk, res, '\"talk\"')
 // eslint-disable-next-line no-useless-escape
 || validateTalk(talk.watchedAt, res, '\"watchedAt\"')
 // eslint-disable-next-line no-useless-escape
 || validateTalk(talk.rate, res, '\"rate\"')
 || next();
};