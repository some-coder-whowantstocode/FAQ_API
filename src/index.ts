import express from 'express';
import bodyParser from "body-parser";
import cors from "cors";
import {connectDB} from "./config/db.ts"
import dotenv from 'dotenv';
import faqRouter from './routes/router.ts';
dotenv.config()

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));
app.use(faqRouter);

(async()=>{
    const success = await connectDB();
    if (success) {
        app.listen(port,()=>{
            console.log(`Server is running on http://localhost:${port}`)
        })
    }
})()

