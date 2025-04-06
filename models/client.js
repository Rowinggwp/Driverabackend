const { DataTypes } = require('sequelize');
const { sequelize } = require('../database/config');

const Client = sequelize.define('client', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  dni: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      notNull: { msg: 'El documento de identidad es obligatorio' },
      notEmpty: { msg: 'El DNI no puede estar vacío' }
    }
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notNull: { msg: 'El nombre es obligatorio' },
      notEmpty: { msg: 'El nombre no puede estar vacío' }
    }
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notNull: { msg: 'El correo es obligatorio' },
      isEmail: { msg: 'Formato de correo inválido' }
    }
  },
  state: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notNull: { msg: 'El número es necesario' },
      notEmpty: { msg: 'El teléfono no puede estar vacío' }
    }
  },
  address: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notNull: { msg: 'La dirección es obligatoria' },
      notEmpty: { msg: 'La dirección no puede estar vacía' }
    }
  }
}, {
  timestamps: true,
  getterMethods: {
    toJSON() {
      const values = { ...this.dataValues };
      // Eliminamos campos técnicos y renombramos ID
      delete values.createdAt;
      delete values.updatedAt;
      values.uid = values.id;
      delete values.id;
      return values;
    }
  }
});

Client.sync({ force: false })
  .then(() => {
    console.log('Tabla de Clientes creada correctamente.');
  })
  .catch(err => {
    console.error('Error al crear la tabla de Clientes:', err);
  });

module.exports = Client;