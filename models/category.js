const { DataTypes } = require('sequelize');
const { sequelize } = require('../database/config');

const Category = sequelize.define('category', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notNull: { msg: 'El nombre es obligatorio' },
      notEmpty: { msg: 'El nombre no puede estar vacío' }
    }
  },
  
  state: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  timestamps: true,
});

Category.sync({ force: false })
  .then(() => {
    console.log('Tabla de categoria creada correctamente.');
  })
  .catch(err => {
    console.error('Error al crear la tabla de categoria:', err);
  });

module.exports = Category;