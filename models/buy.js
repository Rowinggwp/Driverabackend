const { DataTypes, Sequelize } = require('sequelize');
const { sequelize } = require('../database/config');
const User = require('./user');
const Client = require('./client');
const Pay = require('./pay');

const Buy = sequelize.define('buy', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  total: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0,
    validate: {
      min: {
        args: [0],
        msg: 'El total no puede ser negativo'
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
  },
  userId: {  // Relación con User
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id'
    }
  },
  clientId: {  // Relación con Client
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Client,
      key: 'id'
    }
  },
  payId: {  // Relación con Pay
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Pay,
      key: 'numberpay'
    }
  }
}, {
  timestamps: true,
  getterMethods: {
    toJSON() {
      const values = { ...this.dataValues };
      delete values.state;
      delete values.createdAt;
      delete values.updatedAt;
      values.uid = values.id;
      delete values.id;
      return values;
    }
  }
});


User.hasMany(Buy);
Buy.belongsTo(User);
Client.hasMany(Buy);
Buy.belongsTo(Client);
Pay.hasMany(Buy);
Buy.belongsTo(Pay);


Buy.sync({ force: false })
  .then(() => {
    console.log('Tabla de Roles creada correctamente.');
  })
  .catch(err => {
    console.error('Error al crear la tabla de Roles:', err);
  });

module.exports =  Buy ;