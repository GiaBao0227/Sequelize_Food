// src/controllers/rate.controller.js
import { responseSuccess } from "../common/helpers/reponse.helper.js";
import rateService from "../services/rate.service.js";
import { BadRequestException } from "../common/helpers/exception.helper.js";

const rateController = {
  addOrUpdateRating: async (req, res, next) => {
    try {
      // Lấy thông tin từ body (do không có login)
      const { userId, restaurantId, amount } = req.body;
      if (
        userId === undefined ||
        restaurantId === undefined ||
        amount === undefined
      ) {
        return next(
          new BadRequestException(
            "userId, restaurantId, and amount are required in body"
          )
        );
      }
      // Chuyển đổi và kiểm tra
      const uId = parseInt(userId, 10);
      const rId = parseInt(restaurantId, 10);
      const ratingAmount = parseInt(amount, 10);
      if (isNaN(uId) || isNaN(rId) || isNaN(ratingAmount)) {
        return next(
          new BadRequestException(
            "userId, restaurantId, and amount must be valid numbers"
          )
        );
      }
      // Service sẽ kiểm tra range của amount

      const result = await rateService.addOrUpdateRating(
        uId,
        rId,
        ratingAmount
      );
      const message =
        result.status === "created"
          ? "Rating added successfully"
          : "Rating updated successfully";
      res.status(200).json(responseSuccess(result, message));
    } catch (error) {
      next(error);
    }
  },

  getRatingsByRestaurant: async (req, res, next) => {
    try {
      const { resId } = req.params;
      if (!resId || isNaN(parseInt(resId, 10))) {
        return next(
          new BadRequestException(
            "Valid restaurant ID (resId) in URL param is required"
          )
        );
      }
      const result = await rateService.getRatingsByRestaurantId(
        parseInt(resId, 10)
      );
      res
        .status(200)
        .json(
          responseSuccess(result, `Restaurant ratings fetched successfully`)
        );
    } catch (error) {
      next(error);
    }
  },

  getRatingsByUser: async (req, res, next) => {
    try {
      const { userId } = req.params;
      if (!userId || isNaN(parseInt(userId, 10))) {
        return next(
          new BadRequestException(
            "Valid user ID (userId) in URL param is required"
          )
        );
      }
      const result = await rateService.getRatingsByUserId(parseInt(userId, 10));
      res
        .status(200)
        .json(responseSuccess(result, `User ratings fetched successfully`));
    } catch (error) {
      next(error);
    }
  },
};

export default rateController;
