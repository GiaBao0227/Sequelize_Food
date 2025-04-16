// server.js
import express from "express";
import cors from "cors";
import "dotenv/config";

import rootRouter from "./src/routers/root.router.js";
import { handleError } from "./src/common/helpers/error.helper.js";
import { connectSequelizeDB } from "./src/common/sequelize/connect.sequelize.js";
import { NODE_ENV, PORT } from "./src/common/constant/app.constant.js"; // Import constants
import { NotFoundException } from "./src/common/helpers/exception.helper.js"; // Import NotFoundException trực tiếp

const app = express();

// --- Database Connection ---
connectSequelizeDB();

// --- Middlewares ---
app.use(cors());
app.use(express.json());
// app.use(express.static("public"));

// --- API Routes ---
app.use("/api/v1", rootRouter);

// --- Handle Not Found Routes ---
app.all("*", (req, res, next) => {
  next(new NotFoundException(`Can't find ${req.originalUrl} on this server!`));
});

// --- Global Error Handling Middleware ---
app.use(handleError);

// --- Start Server ---
app.listen(PORT, () => {
  console.log(
    `Server is running successfully on http://localhost:${PORT} [${NODE_ENV}]`
  );
  console.log(`API root available at http://localhost:${PORT}/api/v1`);
});
