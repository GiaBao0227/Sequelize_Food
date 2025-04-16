import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class SubFood extends Model {
  static init(sequelize, DataTypes) {
  return super.init({
    subId: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      field: 'sub_id'
    },
    foodId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'food',
        key: 'food_id'
      },
      field: 'food_id'
    },
    subName: {
      type: DataTypes.STRING(100),
      allowNull: true,
      field: 'sub_name'
    }
  }, {
    sequelize,
    tableName: 'sub_food',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "sub_id" },
        ]
      },
      {
        name: "idx_sub_food",
        using: "BTREE",
        fields: [
          { name: "food_id" },
        ]
      },
    ]
  });
  }
}
