const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const PORT = 3000;

let users = [];

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Route to GET all users - returns the users array as JSON
app.get('/users', (req, res) => {
  res.json(users);
});

// Route to GET a single user by index
app.get('/users/:index', (req, res) => {
  const index = parseInt(req.params.index, 10);
  if (index >= 0 && index < users.length) {
    res.json(users[index]);
  } else {
    res.status(404).json({ message: 'User not found' });
  }
});

// Route to POST a new user - adds a new user to the users array
app.post('/users', (req, res) => {
  const user = req.body; // Extract the user from the request body
  users.push(user); // Add the new user to the users array
  res.status(201).json(user); // Respond with the created user and status code 201
});

// Route to PUT (update) a user by index
app.put('/users/:index', (req, res) => {
  if (index >= 0 && index < users.length) {
    users[index] = req.body;
    res.json(users[index]);
  } else {
    res.status(404).json({ message: 'User not found' });
  }
});

// Route to DELETE a user by index
app.delete('/users/:index', (req, res) => {
  const index = parseInt(req.params.index, 10);
  if (index >= 0 && index < users.length) {
    users.splice(index, 1);
    res.status(204).send();
  } else {
    res.status(404).json({ message: 'User not found' });
  }
});

// Route to search for a user by name
app.get('/search', (req, res) => {
  const name = req.query.name;
  if (!name) {
    return res.status(400).json({ message: 'Name query parameter is required' });
  }
  const user = users.find(u => u.name.toLowerCase() === name.toLowerCase());
  if (user) {
    res.json(user);
  } else {
    res.status(404).json({ message: 'User not found' });
  }
});

app.listen(PORT, () => {
  console.log(`API server is running at http://localhost:${PORT}`);
});