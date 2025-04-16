// src/controllers/like.controller.js
import { responseSuccess } from "../common/helpers/reponse.helper.js";
import likeService from "../services/like.service.js";
import { BadRequestException } from "../common/helpers/exception.helper.js";

const likeController = {
  likeRestaurant: async (req, res, next) => {
    try {
      // Lấy userId và restaurantId từ body (do không có login)
      const { userId, restaurantId } = req.body;
      if (userId === undefined || restaurantId === undefined) {
        return next(
          new BadRequestException(
            "userId and restaurantId are required in body"
          )
        );
      }
      // Chuyển đổi sang số và kiểm tra
      const uId = parseInt(userId, 10);
      const rId = parseInt(restaurantId, 10);
      if (isNaN(uId) || isNaN(rId)) {
        return next(
          new BadRequestException(
            "userId and restaurantId must be valid numbers"
          )
        );
      }

      const result = await likeService.likeRestaurant(uId, rId);
      res
        .status(201)
        .json(responseSuccess(result, `Restaurant liked successfully`));
    } catch (error) {
      next(error);
    }
  },

  unlikeRestaurant: async (req, res, next) => {
    try {
      // Lấy userId từ body và resId từ params (do không có login)
      const { userId } = req.body;
      const { resId } = req.params; // Lấy từ URL

      if (userId === undefined || !resId) {
        return next(
          new BadRequestException(
            "userId in body and resId in URL param are required"
          )
        );
      }
      const uId = parseInt(userId, 10);
      const rId = parseInt(resId, 10);
      if (isNaN(uId) || isNaN(rId)) {
        return next(
          new BadRequestException("userId and resId must be valid numbers")
        );
      }

      const result = await likeService.unlikeRestaurant(uId, rId);
      res
        .status(200)
        .json(responseSuccess(result, `Restaurant unliked successfully`));
    } catch (error) {
      next(error);
    }
  },

  getLikesByRestaurant: async (req, res, next) => {
    try {
      const { resId } = req.params;
      if (!resId || isNaN(parseInt(resId, 10))) {
        return next(
          new BadRequestException(
            "Valid restaurant ID (resId) in URL param is required"
          )
        );
      }
      const result = await likeService.getLikesByRestaurantId(
        parseInt(resId, 10)
      );
      res
        .status(200)
        .json(responseSuccess(result, `Restaurant likes fetched successfully`));
    } catch (error) {
      next(error);
    }
  },

  getLikesByUser: async (req, res, next) => {
    try {
      const { userId } = req.params;
      if (!userId || isNaN(parseInt(userId, 10))) {
        return next(
          new BadRequestException(
            "Valid user ID (userId) in URL param is required"
          )
        );
      }
      const result = await likeService.getLikesByUserId(parseInt(userId, 10));
      res
        .status(200)
        .json(responseSuccess(result, `User likes fetched successfully`));
    } catch (error) {
      next(error);
    }
  },
};
export default likeController;
