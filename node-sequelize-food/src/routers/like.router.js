// src/routers/like.router.js
import express from "express";
import likeController from "../controllers/like.controller.js";
// Không import protect middleware nữa

const likeRouter = express.Router();

// POST /api/v1/likes - Like a restaurant
// Body: { "userId": 1, "restaurantId": 123 }
likeRouter.post("/", likeController.likeRestaurant); // Bỏ protect

// DELETE /api/v1/likes/:resId - Unlike a restaurant
// Body: { "userId": 1 }
// Param: resId=123
likeRouter.delete("/:resId", likeController.unlikeRestaurant); // Bỏ protect

// GET /api/v1/likes/restaurant/:resId - Get users who liked a restaurant
likeRouter.get("/restaurant/:resId", likeController.getLikesByRestaurant);

// GET /api/v1/likes/user/:userId - Get restaurants liked by a user
likeRouter.get("/user/:userId", likeController.getLikesByUser);

export default likeRouter;
