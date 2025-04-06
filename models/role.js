const { DataTypes } = require('sequelize');
const { sequelize } = require('../database/config');

const Role = sequelize.define('role', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  role: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notNull: { msg: 'El rol es obligatorio' },
      notEmpty: { msg: 'El rol no puede estar vacío' }
    }
  }
}, {
  timestamps: true, // Crea automáticamente createdAt y updatedAt
});


Role.sync({ force: false })
.then(() => {
  console.log('Tabla de Roles creada correctamente.');
})
.catch(err => {
  console.error('Error al crear la tabla de Roles:', err);
});


module.exports = Role;