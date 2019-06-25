const jwt = require('jsonwebtoken');
const redisClient = require('./signin').redisClient;

const handleRegister = (req, res, db, bcrypt) => {
  const { email, name, password } = req.body;
  if (!email || !name || !password) {
    return Promise.reject('incorrect submition...');
  }
  const hash = bcrypt.hashSync(password);
  return db
    .transaction(trx => {
      trx
        .insert({
          hash,
          email,
        })
        .into('login')
        .returning('email')
        .then(loginEmail => {
          return trx('users')
            .returning('*')
            .insert({
              email: loginEmail[0],
              name: name,
              joined: new Date(),
            })
            .then(user => {
              return user[0];
            });
        })
        .then(trx.commit)
        .catch(trx.rollback);
    })
    .catch(err => Promise.reject('Unable to register...'));
};

const signToken = email => {
  const jwtSecret = process.env.JWT_SECRET;
  const jwtPayload = { email };
  return jwt.sign(jwtPayload, jwtSecret, { expiresIn: '2 days' });
};

const setToken = (token, value) => {
  return Promise.resolve(redisClient.set(token, value));
};

const createSessions = user => {
  // JWT token, return user data
  const { email, id } = user;
  const token = signToken(email);

  return setToken(token, id)
    .then(() => {
      return { success: 'true', userId: id, token: token };
    })
    .catch(console.log);
};

const registerAuthentication = (req, res, db, bcrypt) => {
  const { authorization } = req.headers;
  return authorization
    ? Promise.reject('incorrect submition...')
    : handleRegister(req, res, db, bcrypt)
        .then(data => {
          return data.id && data.email
            ? createSessions(data)
            : Promise.reject(data);
        })
        .then(session => res.json(session))
        .catch(err => res.status(400).json(err));
};

module.exports = {
  handleRegister,
  registerAuthentication,
};
