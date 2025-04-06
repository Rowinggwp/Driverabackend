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
    unique: true,
    validate: {
      notNull: { msg: 'El nombre de la categoría es obligatorio' },
      notEmpty: { msg: 'El nombre no puede estar vacío' }
    }
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
      // Eliminamos campos técnicos y state del output
      delete values.state;
      delete values.createdAt;
      delete values.updatedAt;
      return values;
    }
  }
});

Category.sync({ force: false })
  .then(() => {
    console.log('Tabla de categoria creada correctamente.');
  })
  .catch(err => {
    console.error('Error al crear la tabla de categoria:', err);
  });

module.exports = Category;