// src/controllers/order.controller.js
import { responseSuccess } from "../common/helpers/reponse.helper.js";
import orderService from "../services/order.service.js";
import { BadRequestException } from "../common/helpers/exception.helper.js";

const orderController = {
  placeOrder: async (req, res, next) => {
    try {
      // Lấy userId từ body (do không có login)
      const { userId, items } = req.body; // items = [{ foodId, quantity }]

      if (userId === undefined) {
        return next(
          new BadRequestException("Field 'userId' is required in body")
        );
      }
      if (!items || !Array.isArray(items) || items.length === 0) {
        return next(
          new BadRequestException(
            "Field 'items' (array) is required and cannot be empty in body"
          )
        );
      }
      const uId = parseInt(userId, 10);
      if (isNaN(uId)) {
        return next(new BadRequestException("userId must be a valid number"));
      }

      // Service sẽ kiểm tra định dạng của items
      const result = await orderService.placeOrder(uId, items);
      res
        .status(201)
        .json(responseSuccess(result, `Order placed successfully`));
    } catch (error) {
      next(error);
    }
  },

  // Lấy order theo userId truyền qua params (thay vì /my-orders)
  getOrdersByUserId: async (req, res, next) => {
    try {
      const { userId } = req.params; // Lấy userId từ URL
      if (!userId || isNaN(parseInt(userId, 10))) {
        return next(
          new BadRequestException(
            "Valid user ID (userId) in URL param is required"
          )
        );
      }
      const uId = parseInt(userId, 10);
      const result = await orderService.getOrdersByUserId(uId); // Service method giữ nguyên
      res
        .status(200)
        .json(
          responseSuccess(result, `Orders for user ${uId} fetched successfully`)
        );
    } catch (error) {
      next(error);
    }
  },
};

export default orderController;
