// app.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const routes = require('./routes');
const errorHandler = require('./utils/errorHandler');

dotenv.config();
const app = express();
app.use(cors());
const port = process.env.PORT || 3000;

// Connect to Database
connectDB();

// Middleware to parse JSON
app.use(express.json());

// Routes
app.use('/api/villagevoice', routes);

// Global Error Handler
app.use(errorHandler);

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
