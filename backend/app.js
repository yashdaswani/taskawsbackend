// server.js
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.DB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
const connection = mongoose.connection;
connection.once('open', () => {
  console.log('Connected to MongoDB');
});

// Routes
const userRoutes = require('./routes/userRoutes');
const taskRoutes = require('./routes/taskRoutes');

app.use('/api/users', userRoutes);
app.use('/api/tasks', taskRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
