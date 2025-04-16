// src/routers/rate.router.js
import express from "express";
import rateController from "../controllers/rate.controller.js";
// Không import protect middleware nữa

const rateRouter = express.Router();

// POST /api/v1/ratings - Add or update a rating
// Body: { "userId": 1, "restaurantId": 123, "amount": 5 }
rateRouter.post("/", rateController.addOrUpdateRating); // Bỏ protect

// GET /api/v1/ratings/restaurant/:resId - Get ratings for a restaurant
rateRouter.get("/restaurant/:resId", rateController.getRatingsByRestaurant);

// GET /api/v1/ratings/user/:userId - Get ratings by a user
rateRouter.get("/user/:userId", rateController.getRatingsByUser);

export default rateRouter;
