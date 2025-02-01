import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url'; 
import { connectDB } from './config/db.ts';
import faqRouter from './routes/router.ts';

dotenv.config();

const app = express();
const port = process.env.PORT || 9310;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'public')));

app.use('/api', faqRouter);

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

export default app;
