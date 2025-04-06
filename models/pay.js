const { DataTypes, Sequelize } = require('sequelize');
const { sequelize } = require('../database/config');

const Pay = sequelize.define('pay', {
  numberpay: {
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
  getterMethods: {
    toJSON() {
      const values = { ...this.dataValues };
      delete values.createdAt;
      delete values.updatedAt;
      delete values.state;
      return values;
    }
  }
});

Pay.sync({ force: false })
  .then(() => {
    console.log('Tabla de pagos creada correctamente.');
  })
  .catch(err => {
    console.error('Error al crear la tabla de pagos:', err);
  });

module.exports = Pay;