// src/routers/root.router.js
import express from "express";

// Không import authRouter nữa
import likeRouter from "./like.router.js";
import rateRouter from "./rate.router.js";
import orderRouter from "./order.router.js";
// Import các router khác nếu có

const rootRouter = express.Router();

// Gắn các router con
// rootRouter.use('/auth', authRouter); // Dòng này bị xóa
rootRouter.use("/likes", likeRouter);
rootRouter.use("/ratings", rateRouter);
rootRouter.use("/orders", orderRouter);

// Health check endpoint
rootRouter.get("/", (req, res) => {
  res.status(200).json({ message: "API is running (no auth)" });
});

export default rootRouter;
