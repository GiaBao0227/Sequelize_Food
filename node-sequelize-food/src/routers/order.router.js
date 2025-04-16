// src/routers/order.router.js
import express from "express";
import orderController from "../controllers/order.controller.js";
// Không import protect middleware nữa

const orderRouter = express.Router();

// POST /api/v1/orders - Place a new order
// Body: { "userId": 1, "items": [{ "foodId": 1, "quantity": 2 }] }
orderRouter.post("/", orderController.placeOrder); // Bỏ protect

// GET /api/v1/orders/user/:userId - Get orders for a specific user ID (thay vì /my-orders)
orderRouter.get("/user/:userId", orderController.getOrdersByUserId); // Bỏ protect, thay đổi route

export default orderRouter;
