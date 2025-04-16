import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class Restaurant extends Model {
  static init(sequelize, DataTypes) {
  return super.init({
    resId: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      field: 'res_id'
    },
    resName: {
      type: DataTypes.STRING(100),
      allowNull: true,
      field: 'res_name'
    },
    address: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    desc: {
      type: DataTypes.STRING(255),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'restaurant',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "res_id" },
        ]
      },
    ]
  });
  }
}
