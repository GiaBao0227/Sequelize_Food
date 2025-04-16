import _sequelize from "sequelize";
const DataTypes = _sequelize.DataTypes;
import _Food from  "./Food.js";
import _FoodType from  "./FoodType.js";
import _LikeRes from  "./LikeRes.js";
import _Order from  "./Order.js";
import _RateRes from  "./RateRes.js";
import _Restaurant from  "./Restaurant.js";
import _SubFood from  "./SubFood.js";
import _SubPrice from  "./SubPrice.js";
import _User from  "./User.js";

export default function initModels(sequelize) {
  const Food = _Food.init(sequelize, DataTypes);
  const FoodType = _FoodType.init(sequelize, DataTypes);
  const LikeRes = _LikeRes.init(sequelize, DataTypes);
  const Order = _Order.init(sequelize, DataTypes);
  const RateRes = _RateRes.init(sequelize, DataTypes);
  const Restaurant = _Restaurant.init(sequelize, DataTypes);
  const SubFood = _SubFood.init(sequelize, DataTypes);
  const SubPrice = _SubPrice.init(sequelize, DataTypes);
  const User = _User.init(sequelize, DataTypes);

  Restaurant.belongsToMany(User, { as: 'userIdUsers', through: LikeRes, foreignKey: "resId", otherKey: "userId" });
  Restaurant.belongsToMany(User, { as: 'userIdUserRateRes', through: RateRes, foreignKey: "resId", otherKey: "userId" });
  User.belongsToMany(Restaurant, { as: 'resIdRestaurants', through: LikeRes, foreignKey: "userId", otherKey: "resId" });
  User.belongsToMany(Restaurant, { as: 'resIdRestaurantRateRes', through: RateRes, foreignKey: "userId", otherKey: "resId" });
  SubFood.belongsTo(Food, { as: "food", foreignKey: "foodId"});
  Food.hasMany(SubFood, { as: "subFoods", foreignKey: "foodId"});
  Food.belongsTo(FoodType, { as: "type", foreignKey: "typeId"});
  FoodType.hasMany(Food, { as: "foods", foreignKey: "typeId"});
  LikeRes.belongsTo(Restaurant, { as: "re", foreignKey: "resId"});
  Restaurant.hasMany(LikeRes, { as: "likeRes", foreignKey: "resId"});
  Order.belongsTo(Restaurant, { as: "re", foreignKey: "resId"});
  Restaurant.hasMany(Order, { as: "orders", foreignKey: "resId"});
  RateRes.belongsTo(Restaurant, { as: "re", foreignKey: "resId"});
  Restaurant.hasMany(RateRes, { as: "rateRes", foreignKey: "resId"});
  SubPrice.belongsTo(SubFood, { as: "sub", foreignKey: "subId"});
  SubFood.hasOne(SubPrice, { as: "subPrice", foreignKey: "subId"});
  LikeRes.belongsTo(User, { as: "user", foreignKey: "userId"});
  User.hasMany(LikeRes, { as: "likeRes", foreignKey: "userId"});
  Order.belongsTo(User, { as: "user", foreignKey: "userId"});
  User.hasMany(Order, { as: "orders", foreignKey: "userId"});
  RateRes.belongsTo(User, { as: "user", foreignKey: "userId"});
  User.hasMany(RateRes, { as: "rateRes", foreignKey: "userId"});

  return {
    Food,
    FoodType,
    LikeRes,
    Order,
    RateRes,
    Restaurant,
    SubFood,
    SubPrice,
    User,
  };
}
