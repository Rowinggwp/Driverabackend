const { DataTypes, Sequelize } = require('sequelize');
const { sequelize } = require('../database/config');

const Pay = sequelize.define('pay', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  amountpay: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0,
    validate: {
      min: {
        args: [0],
        msg: 'El monto no puede ser negativo'
      }
    }
  },
  date: {
    type: DataTypes.DATE,
    defaultValue: Sequelize.NOW
  },
  state: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  timestamps: true,
});

Pay.sync({ force: false })
  .then(() => {
    console.log('Tabla de pagos creada correctamente.');
  })
  .catch(err => {
    console.error('Error al crear la tabla de pagos:', err);
  });

module.exports = Pay;