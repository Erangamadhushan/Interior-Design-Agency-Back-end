const express = require('express');
const cors = require('cors');
const connectDB = require('./config/Connection');
require('dotenv').config();


const app = express();

connectDB();

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

// Define your routes here
app.get('/', (req, res) => {
  res.send('API is running...');
});

app.use('/api/auth/users', require('./routes/users'));
app.use('/api/auth/projects', require('./routes/projects'));

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log('hosted at http://localhost:' + PORT);
});