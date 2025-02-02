const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const { connectDB } = require('./config/db.js');
const faqRouter = require('./routes/router.js');
const redis = require('./config/redisClient.js');
const errorHandler = require('./middleware/errorHandler.js');

dotenv.config();

const app = express();
const port = process.env.PORT || 9310;

app.use(cors());
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'public')));

app.use('/api', faqRouter);
app.use(errorHandler);

(async () => {
  const success = await connectDB();
  
  if (success) {
    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  } else {
    console.error('Failed to connect to the database');
  }
})();

module.exports = app;
