const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const  jwt = require('jsonwebtoken');
const { verifyToken}= require('./middleware/jwt');
const app = express();
const PORT = 3000;


const db = require('./database/db');
const query = require('./database/query');
db.connectDB();

let users = [];

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Route to GET all users - returns the users array as JSON
app.get('/users',verifyToken, (req, res) => {
  query.getAllUsers().then((users) => {
    res.status(200).json(users);
  }).catch((err) => {
    res.status(500).json({ message: 'Internal Server Error' });
  });
});

// Route to GET a single user by index
app.get('/users/:index', verifyToken,(req, res) => {
  const { index } = req.params; // Extract the id from the request parameters
  
  query.getUserById(index).then((user) => {
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  }).catch((err) => {
    res.status(500).json({ message: 'Internal Server Error' });
  });
});


// Route to POST a new user - adds a new user to the users array
app.post('/users', (req, res) => {
  query.createUser(req.body).then((user) => {
    res.status(201).json(user);
  }).catch((err) => {
    res.status(500).json({ message: err.message });
  });
});

// Route to POST a new user - adds a new user to the users array
app.post('/register', async(req, res) => {
  const user = req.body; // Extract the user from the request body
  hashPassword = await bcrypt.hash(user.password, 10);
  user.password = hashPassword;
  query.createUser(user).then((user) => {
    res.status(201).json(user); // Respond with the created user and status code 201
  })
});

app.post('/login', async(req, res) => {
  const user =req.body;
  const validUser = await login(user.username, user.password);
  res.status(200).json(validUser);
});

async function login(username, password){
  const user = await query.searchByUsername(username);
  valid = await bcrypt.compare(password, user[0].password);
  if(!valid){
    throw new Error('Invalid username or password');
  }

  const key = 'secret';
  const token = jwt.sign({ id: user[0]._id }, key, { expiresIn: '1h' });
  return { token: token, user: user[0] };
}

// Route to PUT (update) a user by index
app.put('/users/:index',verifyToken,(req, res) => {
  const { index } = req.params; // Extract the id from the request parameters
  const user = req.body; // Extract the updated user from the request body
  query.updateUser(index, user).then((user) => {
    res.status(200).json(user); // Respond with the updated user
  });
});

// Route to DELETE a user by index
app.delete('/users/:index', verifyToken,(req, res) => {
  const { index } = req.params; // Extract the id from the request parameters
  query.deleteUser(index).then(() => {
    res.status(204).send(); // Respond with no content and status code 204
  });
});

// Route to search for a user by name
app.get('/search', verifyToken,(req, res) => {
  const name = req.query.name;
  query.searchUserByName(name).then((users) => {
    res.json(users);
  }).catch((err) => {
    res.status(500).json({ message: 'Internal Server Error' });
  });
});

app.listen(PORT, () => {
  console.log(`API server is running at http://localhost:${PORT}`);
});