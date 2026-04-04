import express from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import apiRoutes from "./routes/index.js";
import { errorHandler, notFoundHandler } from "./middlewares/errorHandler.js";

const corsOptions = {
  origin: "*",
  credentials: true,
};

const app = express();

app.use(helmet());
app.use(cors(corsOptions));
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1", apiRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;

