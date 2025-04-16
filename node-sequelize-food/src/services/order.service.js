// src/services/order.service.js
import sequelize from '../common/sequelize/connect.sequelize.js'; // Import the instance for transactions
import { models } from '../common/sequelize/connect.sequelize.js';
import { NotFoundException, BadRequestException } from '../common/helpers/exception.helper.js';

const orderService = {
    /**
     * Creates a new order for a user with the specified items.
     * Uses a transaction to ensure atomicity.
     * @param {number} userId - The ID of the user placing the order.
     * @param {Array<{foodId: number, quantity: number}>} items - Array of items to order.
     * @returns {Promise<object>} The created order object with its items.
     */
    placeOrder: async (userId, items) => {
        // Basic validation of items structure
         if (!Array.isArray(items) || items.length === 0) {
             throw new BadRequestException('Order items array cannot be empty.');
         }
         // More detailed validation for each item
         for (const item of items) {
             if (item.foodId === undefined || item.quantity === undefined || typeof item.quantity !== 'number' || !Number.isInteger(item.quantity) || item.quantity <= 0) {
                 throw new BadRequestException(`Each item must have a valid 'foodId' and a positive integer 'quantity'. Problem with item: ${JSON.stringify(item)}`);
             }
             // Optional: Check for duplicate foodId entries in the items array
         }

         // Use a transaction to ensure all operations succeed or fail together
         const transaction = await sequelize.transaction();

        try {
             // 1. Check if user exists
             const user = await models.Users.findByPk(userId, { transaction });
             if (!user) {
                 // Rollback before throwing is good practice, though throwing will implicitly do it
                 // await transaction.rollback(); // Optional explicit rollback
                 throw new NotFoundException(`User with ID ${userId} not found`);
             }

             // 2. Create the main order record
             const order = await models.Orders.create({
                 user_id: userId,
                 // date_order, status are set by defaults/database
                 // total_price will be updated later
             }, { transaction });

             let calculatedTotalPrice = 0;
             const orderItemsData = []; // Prepare data for bulk insertion

             // 3. Process each item: Check food existence, calculate price, prepare item data
             for (const item of items) {
                 const food = await models.Food.findByPk(item.foodId, { transaction });
                 if (!food) {
                     throw new NotFoundException(`Food item with ID ${item.foodId} not found.`);
                 }
                 // Optional: Check if food belongs to a specific restaurant context if needed

                 const priceAtOrder = food.price; // Get current price of the food
                 const itemTotalPrice = priceAtOrder * item.quantity;
                 calculatedTotalPrice += itemTotalPrice;

                 // Prepare item data for bulk create
                 orderItemsData.push({
                     order_id: order.order_id,
                     food_id: item.foodId,
                     quantity: item.quantity,
                     price_at_order: priceAtOrder, // Store the price at the time of order
                 });
             }

             // 4. Bulk create all order items for efficiency
             await models.Order_Items.bulkCreate(orderItemsData, { transaction });

             // 5. Update the total price in the main order record
             order.total_price = calculatedTotalPrice;
             await order.save({ transaction });

             // 6. If everything succeeded, commit the transaction
             await transaction.commit();

             // 7. Return the newly created order with its items for confirmation
             const createdOrder = await models.Orders.findByPk(order.order_id, {
                // Re-fetch outside transaction or use the committed data
                // Including items and food details
                include: [{
                    model: models.Order_Items,
                    as: 'items', // Alias from init-models
                    include: [{
                        model: models.Food,
                        as: 'food', // Alias from init-models
                        attributes: ['food_id', 'food_name', 'image', 'price'] // Include relevant food details
                    }]
                }]
             });

             return createdOrder;

        } catch (error) {
            // If any error occurred during the try block, roll back the transaction
            await transaction.rollback();
            console.error("Order placement transaction failed:", error);
            // Re-throw the original error (could be NotFoundException, BadRequestException, or others)
            // The global error handler will catch this
            throw error;
        }
    },

    /**
     * Gets all orders placed by a specific user, including order items and food details.
     * @param {number} userId - The ID of the user whose orders to fetch.
     * @returns {Promise<Array<object>>} An array of order objects.
     */
    getOrdersByUserId: async (userId) => {
        // Check if user exists
        const user = await models.Users.findByPk(userId);
        if (!user) throw new NotFoundException(`User with ID ${userId} not found`);

        // Find all orders for the user
        const orders = await models.Orders.findAll({
            where: { user_id: userId },
            include: [ // Eager load associated items and their food details
                {
                    model: models.Order_Items,
                    as: 'items', // Alias defined in init-models
                    include: [
                        {
                            model: models.Food,
                            as: 'food', // Alias defined in init-models
                            attributes: ['food_id', 'food_name', 'image', 'price'] // Select desired food fields
                        }
                    ]
                }
            ],
            order: [['date_order', 'DESC']] // Show most recent orders first
        });

        return orders;
    },
};

// !!! IMPORTANT: Export the service object as default !!!
export default orderService;