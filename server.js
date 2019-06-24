const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');
const morgan = require('morgan');

const register = require('./controllers/register');
const profile = require('./controllers/profile');
const signin = require('./controllers/signin');
const image = require('./controllers/image');

const auth = require('./controllers/authorization');

// const db = knex({
//   client: 'pg',
//   connection: {
//     connectionString: process.env.DATABASE_URL,
//     ssl: true,
//     user: 'archaeologist',
//     password: 'bandera',
//     database: 'smart-brain-db',
//   },
// });

const db = knex({
  client: 'pg',
  connection: process.env.POSTGRES_URI,
});

// db.select('*')
//   .from('users')
//   .then(data => {});

const app = express();

// app.use(morgan('combined'));
app.use(bodyParser.json());
app.use(cors());

app.get('/', (req, res) => {
  res.send('it is working..');
});

app.post('/signin', (req, res) => {
  signin.signinAuthentication(req, res, db, bcrypt);
});

app.post('/register', (req, res) => {
  register.handleRegister(req, res, db, bcrypt);
});

app.get('/profile/:id', auth.requireAuth, (req, res) => {
  profile.handleProfileGet(req, res, db);
});

app.post('/profile/:id', auth.requireAuth, (req, res) => {
  profile.handleProfileUpdate(req, res, db);
});

app.put('/image', auth.requireAuth, (req, res) => {
  image.handleImage(req, res, db);
});

app.post('/imageurl', auth.requireAuth, (req, res) => {
  image.handleApiCall(req, res);
});

const PORT = process.env.PORT || 3000;
console.log(PORT);

app.listen(PORT, () => {
  console.log(`app is running on port ${PORT}`);
});

/*
/ --> res = this is working
/signin --> POST = success/fail
/register --> POST = user
/profile/:userid --> GET = user
/image --> PUT = user

*/
