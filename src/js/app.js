import express from 'express';
import cookieParser from 'cookie-parser';

import { corsMw, helmetMw } from './middleware/index.js'
import { csrfRouter } from './routes/index.js'
import { API_PREFIX } from './config/env.js'

const app = express();

app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(express.json({ limit: '10kb' }));
app.use(cookieParser());

app.use(corsMw);
app.use(helmetMw);

app.set('trust proxy', 1);

app.use(API_PREFIX, csrfRouter)

app.get('/health', (_req, res) => {
    console.log(`[${new Date().toISOString()}] GET /health`);
    res.status(200).json({ status: 'ok', uptime: process.uptime() });
  });

export { app }