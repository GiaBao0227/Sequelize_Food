import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class FoodType extends Model {
  static init(sequelize, DataTypes) {
  return super.init({
    typeId: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      field: 'type_id'
    },
    typeName: {
      type: DataTypes.STRING(100),
      allowNull: true,
      field: 'type_name'
    }
  }, {
    sequelize,
    tableName: 'food_type',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "type_id" },
        ]
      },
    ]
  });
  }
}
