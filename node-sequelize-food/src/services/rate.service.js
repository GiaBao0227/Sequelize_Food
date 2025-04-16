// src/services/rate.service.js
import { models } from "../common/sequelize/connect.sequelize.js";
import {
  NotFoundException,
  BadRequestException,
} from "../common/helpers/exception.helper.js";

const rateService = {
  /**
   * Adds a new rating or updates an existing one for a user and restaurant.
   * @param {number} userId - The ID of the user rating the restaurant.
   * @param {number} restaurantId - The ID of the restaurant being rated.
   * @param {number} amount - The rating amount (e.g., 1-5).
   * @returns {Promise<object>} The created or updated rating record with a status.
   */
  addOrUpdateRating: async (userId, restaurantId, amount) => {
    // Validate rating amount (assuming 1-5 stars)
    if (amount < 1 || amount > 5 || !Number.isInteger(amount)) {
      // Ensure it's an integer between 1 and 5
      throw new BadRequestException(
        "Rating amount must be an integer between 1 and 5"
      );
    }

    // Check if user and restaurant exist
    const user = await models.Users.findByPk(userId);
    const restaurant = await models.Restaurants.findByPk(restaurantId);
    if (!user) throw new NotFoundException(`User with ID ${userId} not found`);
    if (!restaurant)
      throw new NotFoundException(
        `Restaurant with ID ${restaurantId} not found`
      );

    // Use findOrCreate to handle existing ratings
    const [rating, created] = await models.Rate_Res.findOrCreate({
      where: { user_id: userId, res_id: restaurantId },
      defaults: {
        // Data used only if creating a new record
        amount: amount,
        // date_rate uses default value
      },
    });

    // If the rating already existed (was not created), update its amount and date
    if (!created) {
      rating.amount = amount;
      rating.date_rate = new Date(); // Explicitly update the date on modification
      await rating.save(); // Save the changes
      return { ...rating.toJSON(), status: "updated" };
    }

    // If newly created, return the rating record
    return { ...rating.toJSON(), status: "created" };
  },

  /**
   * Gets all ratings for a specific restaurant, including user details.
   * @param {number} restaurantId - The ID of the restaurant.
   * @returns {Promise<Array<object>>} An array of rating records with associated user details.
   */
  getRatingsByRestaurantId: async (restaurantId) => {
    const restaurant = await models.Restaurants.findByPk(restaurantId);
    if (!restaurant)
      throw new NotFoundException(
        `Restaurant with ID ${restaurantId} not found`
      );

    const ratings = await models.Rate_Res.findAll({
      where: { res_id: restaurantId },
      include: [
        // Include user details
        {
          model: models.Users,
          as: "user",
          attributes: ["user_id", "full_name", "email"],
        },
      ],
      order: [["date_rate", "DESC"]], // Show newest ratings first
    });
    return ratings;
  },

  /**
   * Gets all ratings made by a specific user, including restaurant details.
   * @param {number} userId - The ID of the user.
   * @returns {Promise<Array<object>>} An array of rating records with associated restaurant details.
   */
  getRatingsByUserId: async (userId) => {
    const user = await models.Users.findByPk(userId);
    if (!user) throw new NotFoundException(`User with ID ${userId} not found`);

    const ratings = await models.Rate_Res.findAll({
      where: { user_id: userId },
      include: [
        // Include restaurant details
        {
          model: models.Restaurants,
          as: "restaurant",
          attributes: ["res_id", "res_name", "image"],
        },
      ],
      order: [["date_rate", "DESC"]], // Show newest ratings first
    });
    return ratings;
  },
};

// !!! IMPORTANT: Export the service object as default !!!
export default rateService;
