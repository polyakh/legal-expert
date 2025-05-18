import express from "express";
import cookieParser from "cookie-parser";

import { corsMw, helmetMw, errorHandlerMw } from "./middleware/index.js";
import { HttpError } from "./errors/http-error.js";

import { csrfRouter, contactRouter } from "./routes/index.js";
import { API_PREFIX } from "./config/env.js";

const app = express();

app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(express.json({ limit: "10kb" }));
app.use(cookieParser());

app.use(corsMw);
app.use(helmetMw);

app.set("trust proxy", 1);

app.use(API_PREFIX, csrfRouter);
app.use(API_PREFIX, contactRouter);

app.get("/health", (_req, res) => {
  console.log(`[${new Date().toISOString()}] GET /health`);
  res.status(200).json({ status: "ok", uptime: process.uptime() });
});

app.use((_req, _res, next) => next(new HttpError(404, "Маршрут не знайдено")));

app.use(errorHandlerMw);

export { app };
