const { DataTypes } = require('sequelize');
const { sequelize } = require('../database/config');

const Provider = sequelize.define('provider', {
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
      notNull: { msg: 'El nombre es obligatorio' },
      notEmpty: { msg: 'El nombre no puede estar vacío' }
    }
  },
  company: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notNull: { msg: 'El nombre de la empresa es obligatorio' },
      notEmpty: { msg: 'La empresa no puede estar vacía' }
    }
  },
  contact: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notNull: { msg: 'El contacto es obligatorio' },
      notEmpty: { msg: 'El contacto no puede estar vacío' }
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
  phone: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notNull: { msg: 'El teléfono es obligatorio' },
      notEmpty: { msg: 'El teléfono no puede estar vacío' }
    }
  },
  productexport: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notNull: { msg: 'Debe colocar el producto exportado' },
      notEmpty: { msg: 'El producto exportado no puede estar vacío' }
    }
  },
  address: {
    type: DataTypes.STRING,
    defaultValue: ''
  },
  state: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    allowNull: false
  }
}, {
  timestamps: true,
  getterMethods: {
    toJSON() {
      const values = { ...this.dataValues };
      // Sequelize no tiene __v, pero mantenemos la estructura original
      delete values.createdAt;
      delete values.updatedAt;
      return values;
    }
  }
});

Provider.sync({ force: false })
  .then(() => {
    console.log('Tabla de Provedores creada correctamente.');
  })
  .catch(err => {
    console.error('Error al crear la tabla de Provedores:', err);
  });

module.exports = Provider;