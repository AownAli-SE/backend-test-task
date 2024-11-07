import express from "express";
import cors from "cors";

const app = express();

// setting up middlewares
app.use(express.json());

const allowedOrigins = ["http://localhost:3000"];
app.use(
  cors({
    origin(requestOrigin, callback) {
      if (!requestOrigin || allowedOrigins.includes(requestOrigin)) {
        return callback(null, true);
      } else {
        callback(new Error("Origin not allowed"));
      }
    },
  })
);

export default app;
