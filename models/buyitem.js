const { DataTypes} = require('sequelize');
const { sequelize } = require("../database/config");
const Product = require("./product");
const Buy = require('./buy');

const BuyItem = sequelize.define('buyItem', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
      validate: {
        min: {
          args: [1],
          msg: 'La cantidad mínima es 1'
        }
      }
    },
    buyId: {  // Relación con Client
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Buy,
        key: 'id'
      }
    },
    productId: {  // Relación con Client
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Product,
        key: 'id'
      }
    },
  });
  Buy.hasMany(BuyItem);
  BuyItem.belongsTo(Buy);
  Product.hasMany(BuyItem);
  BuyItem.belongsTo(Product);
  

 BuyItem.sync({ force: false })
  .then(() => {
    console.log('Tabla de compra items creada correctamente.');
  })
  .catch(err => {
    console.error('Error al crear la tabla de compra items:', err);
  });

module.exports = BuyItem;