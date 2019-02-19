const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');


const app = express();

app.use(bodyParser.json());
app.use(cors());

const database = {
  users: [
    {
      id: '123',
      name: 'John',
      email: 'john@gmail.com',
      password: 'cookies',
      entries: 0,
      joined: new Date(),
    },
    {
      id: '124',
      name: 'Sally',
      email: 'sally@gmail.com',
      password: 'bananas',
      entries: 0,
      joined: new Date(),
    },
  ],
  login: [
    {
      id: '987',
      hash: '',
      email: 'john@gmail.com',
    },
  ],
};

app.get('/', (req, res) => {
  res.send(database.users);
});

//SINGIN
app.post('/signin', (req, res) => {
  // Load hash from your password DB.
  bcrypt.compare('apples', '$2a$10$qVZRCLs4nU290B.DPT4JGu7na4J6SPCYxIHGd0O.2a2X/JKxyk6jW', function(err, res) {
    console.log(res);
    
  });
  bcrypt.compare('veggies', '$2a$10$qVZRCLs4nU290B.DPT4JGu7na4J6SPCYxIHGd0O.2a2X/JKxyk6jW', function(err, res) {
    console.log(res);
  });
  if (
    req.body.email === database.users[0].email &&
    req.body.password === database.users[0].password
  ) {
    res.json(database.users[0]);
  } else {
    res.status(400).json('error loggin in');
  }
});

//REGISTER
app.post('/register', (req, res) => {
  const { email, name, password } = req.body;
  //   bcrypt.hash(password, null, null, function(err, hash) {
  //     console.log(hash);
  // });
  database.users.push({
    id: '125',
    name: name,
    email: email,
    entries: 0,
    joined: new Date(),
  });
  res.json(database.users[database.users.length - 1]);
});

app.get('/profile/:id', (req, res) => {
  const { id } = req.params;
  let found = false;
  database.users.forEach(user => {
    if (user.id === id) {
      return res.json(user);
      found = true;
    }
  });
  if (!found) {
    res.status(400).json('not found');
  }
});

app.put('/image', (req, res) => {
  const { id } = req.body;
  let found = false;
  database.users.forEach(user => {
    if (user.id === id) {
      user.entries++;
      return res.json(user.entries);
      found = true;
    }
  });
  if (!found) {
    res.status(400).json('not found');
  }
});

// bcrypt.hash('bacon', null, null, function(err, hash) {
//   // Store hash in your password DB.
// });

app.listen(3000, () => {
  console.log('app is running on port 3000');
});

/*
/ --> res = this is working
/signin --> POST = success/fail
/register --> POST = user
/profile/:userid --> GET = user
/image --> PUT = user

*/
