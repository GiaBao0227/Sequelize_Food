// src/services/like.service.js
import { models } from "../common/sequelize/connect.sequelize.js";
import {
  NotFoundException,
  BadRequestException,
} from "../common/helpers/exception.helper.js";

const likeService = {
  /**
   * Creates a like record for a user and restaurant.
   * If the like already exists, it returns the existing record.
   * @param {number} userId - The ID of the user liking the restaurant.
   * @param {number} restaurantId - The ID of the restaurant being liked.
   * @returns {Promise<object>} The created or existing like record with a status.
   */
  likeRestaurant: async (userId, restaurantId) => {
    // Check if user and restaurant exist first for better error messages
    const user = await models.Users.findByPk(userId);
    const restaurant = await models.Restaurants.findByPk(restaurantId);
    if (!user) throw new NotFoundException(`User with ID ${userId} not found`);
    if (!restaurant)
      throw new NotFoundException(
        `Restaurant with ID ${restaurantId} not found`
      );

    // Use findOrCreate to handle the case where the like already exists atomically
    const [like, created] = await models.Like_Res.findOrCreate({
      where: { user_id: userId, res_id: restaurantId },
      defaults: {
        // Data to use if the record needs to be created
        user_id: userId,
        res_id: restaurantId,
        // date_like is set by default in the model/database
      },
    });

    if (!created) {
      // If not created, it means the like already existed
      // You could throw an error:
      // throw new BadRequestException('You have already liked this restaurant');
      // Or return the existing like with a specific status:
      return { ...like.toJSON(), status: "already_liked" };
    }

    // If created, return the new like record with a 'liked' status
    return { ...like.toJSON(), status: "liked" };
  },

  /**
   * Removes a like record for a user and restaurant.
   * @param {number} userId - The ID of the user unliking the restaurant.
   * @param {number} restaurantId - The ID of the restaurant being unliked.
   * @returns {Promise<object>} An object indicating success and the count of deleted records.
   */
  unlikeRestaurant: async (userId, restaurantId) => {
    // Optional: Check if user/restaurant exists for better context, though not strictly needed for deletion.
    // const user = await models.Users.findByPk(userId);
    // if (!user) throw new NotFoundException(`User with ID ${userId} not found`);
    // const restaurant = await models.Restaurants.findByPk(restaurantId);
    // if (!restaurant) throw new NotFoundException(`Restaurant with ID ${restaurantId} not found`);

    const result = await models.Like_Res.destroy({
      where: {
        user_id: userId,
        res_id: restaurantId,
      },
    });

    if (result === 0) {
      // If result is 0, no record matched the where clause
      throw new NotFoundException(
        `Like record not found for user ${userId} and restaurant ${restaurantId}. Cannot unlike.`
      );
    }

    // Return success message and the number of rows deleted (should be 1)
    return { message: "Unlike successful", deletedCount: result };
  },

  /**
   * Gets all likes for a specific restaurant, including user details.
   * @param {number} restaurantId - The ID of the restaurant.
   * @returns {Promise<Array<object>>} An array of like records with associated user details.
   */
  getLikesByRestaurantId: async (restaurantId) => {
    const restaurant = await models.Restaurants.findByPk(restaurantId);
    if (!restaurant)
      throw new NotFoundException(
        `Restaurant with ID ${restaurantId} not found`
      );

    const likes = await models.Like_Res.findAll({
      where: { res_id: restaurantId },
      include: [
        // Include associated User data
        {
          model: models.Users,
          as: "user", // Use the alias defined in init-models.js
          attributes: ["user_id", "full_name", "email"], // Select only needed user fields
        },
      ],
      order: [["date_like", "DESC"]], // Optional: Order by date, newest first
    });
    return likes;
  },

  /**
   * Gets all likes made by a specific user, including restaurant details.
   * @param {number} userId - The ID of the user.
   * @returns {Promise<Array<object>>} An array of like records with associated restaurant details.
   */
  getLikesByUserId: async (userId) => {
    const user = await models.Users.findByPk(userId);
    if (!user) throw new NotFoundException(`User with ID ${userId} not found`);

    const likes = await models.Like_Res.findAll({
      where: { user_id: userId },
      include: [
        // Include associated Restaurant data
        {
          model: models.Restaurants,
          as: "restaurant", // Use the alias defined in init-models.js
          attributes: ["res_id", "res_name", "image"], // Select only needed restaurant fields
        },
      ],
      order: [["date_like", "DESC"]], // Optional: Order by date, newest first
    });
    return likes;
  },
};

// !!! IMPORTANT: Export the service object as default !!!
export default likeService;
