import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import { HttpError, Forbidden } from "http-errors";
import path from "path";

import { logError } from "./services/loggingService";
import { responseMiddleware } from "./middlewares/responseMiddleware";
import { authMiddleware } from "./middlewares/authMiddleware";

import authRouter from "./routes/authRoute";
import categoryRouter from "./routes/categoryRoutes";
import carRouter from "./routes/carRoute";
import helmet from "helmet";

const app = express();

// setting up middlewares
app.use(express.json());
app.use(express.static(path.join(__dirname, "..", "public")));
app.use(helmet());
app.use(responseMiddleware);

app.use(
  cors({
    origin(requestOrigin, callback) {
      const allowedOrigins = ["http://localhost:5173"];

      if (!requestOrigin || allowedOrigins.includes(requestOrigin)) {
        return callback(null, true);
      } else {
        logError("CORS error! Access denied.", "CORS error! Access denied.", requestOrigin);
        callback(Forbidden("CORS error! Access denied."));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

// Routes
app.use("/api/auth", authRouter);
app.use("/api/categories", authMiddleware, categoryRouter);
app.use("/api/cars", authMiddleware, carRouter);

// Express error middleware
app.use((err: HttpError, req: Request, res: Response, next: NextFunction) => {
  logError(err.message, err, { body: req.body, url: req.originalUrl, headers: req.headers });

  const errorMessage = err.statusCode === 500 ? "Internal server error" : err.message;
  const statusCode = err.statusCode || 400;

  res.error(statusCode, errorMessage);
});

export default app;
