const { DataTypes } = require('sequelize');
const { sequelize } = require('../database/config');
const Role = require('./role');
 // Ajusta la ruta según tu estructura

const User = sequelize.define('users', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notNull: { msg: 'El nombre es obligatorio' }
    }
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      notNull: { msg: 'El correo es obligatorio' },
      isEmail: { msg: 'Formato de correo inválido' }
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notNull: { msg: 'La contraseña es obligatoria' }
    }
  },
  roleId: {
    type: DataTypes.INTEGER,
    references: {
      model: Role,
      key: 'id'
    }
},
  state: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  timestamps: true, // Crea automáticamente createdAt y updatedAt
});

// En tu modelo User.js
User.belongsTo(Role, {
  foreignKey: 'roleId',
  as: 'roleInfo' // Este alias es importante
});

Role.hasMany(User);
User.belongsTo(Role);

User.sync({ force: false })
  .then(() => {
    console.log('Tabla de usuarios creada correctamente.');
  })
  .catch(err => {
    console.error('Error al crear la tabla de usuarios:', err);
  });


module.exports = User;