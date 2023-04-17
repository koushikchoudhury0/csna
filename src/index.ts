import express from 'express';
import dotenv from 'dotenv';
import { router } from './api/routes/index.js';
import mongoose from 'mongoose';
import { rateLimiter } from './api/config/limit.config.js';

dotenv.config();
const port = process.env.PORT;
const dbConnectionStr = process.env.DB;

const app = express();
app.use(express.json());
app.use(rateLimiter());
app.use('/api', router);

await mongoose.connect(dbConnectionStr || '');
app.listen(port, () => {
    console.log(`Server running @ ${port}`);
});


