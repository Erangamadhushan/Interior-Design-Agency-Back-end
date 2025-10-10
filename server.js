const express = require('express');
const cors = require('cors');
const connectDB = require('./config/Connection');
require('dotenv').config();
const User = require('./models/User');

const app = express();

connectDB();

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

// Define your routes here
app.get('/', (req, res) => {
  res.send('API is running...');
});
app.post('/api/users', async (req, res) => {
  try {
    const { email, password } = req.body;
    const newUser = new User({ email, password });
    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log('hosted at http://localhost:' + PORT);
});