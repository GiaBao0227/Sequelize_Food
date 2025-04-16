import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class SubPrice extends Model {
  static init(sequelize, DataTypes) {
  return super.init({
    subId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'sub_food',
        key: 'sub_id'
      },
      field: 'sub_id'
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'sub_price',
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
    ]
  });
  }
}
