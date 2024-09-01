const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Importing payment controls
const { newPayment, checkStatus } = require('./src/phonePe');

dotenv.config({ path: ".env" });

const app = express();
const port = process.env.PORT || 3005;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/init', (req, res) => {
  console.log('hi im called');
  res.status(200).json({ name: 'hi, Did you call me.' });
});

app.post('/payment', newPayment);
app.post('/status/:txnId', checkStatus);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({
    success: false,
    message: 'Something went wrong!',
  });
});

// Starting server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

