const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Configure dotenv without verbose output
dotenv.config({ silent: true });

// Only require swagger in production
if (process.env.NODE_ENV === 'production') {
  require('./swagger-output.json');
}

require('./config/db'); // yaha se DB check ho jayega

const app = require('./app');

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
