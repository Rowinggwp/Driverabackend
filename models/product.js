const { DataTypes } = require('sequelize');
const { sequelize } = require('../database/config');
const User = require('./user');
const Category = require('./category');


const Product = sequelize.define('product', {
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
      notNull: { msg: 'sEl nombre es obligatorio' },
      notEmpty: { msg: 'El nombre no puede estar vacío' }
    }
  },
  title: {
    type: DataTypes.STRING,
    defaultValue: ''
  },
  description: {
    type: DataTypes.TEXT,
    defaultValue: ''
  },
  price: {
    type: DataTypes.DECIMAL(10, 2), // Precisión para valores monetarios
    allowNull: false,
    validate: {
      notNull: { msg: 'El precio es obligatorio' },
      min: {
        args: [0],
        msg: 'El precio no puede ser negativo'
      }
    }
  },
  state: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    allowNull: false
  },
  stock: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    validate: {
      min: {
        args: [0],
        msg: 'El stock no puede ser negativo'
      }
    }
  },
  images: {
    type: DataTypes.STRING(1000), // Para URLs largas de imágenes
    get() {
      const rawValue = this.getDataValue('images');
      return rawValue ? rawValue.split(';') : []; // Convertir string a array
    },
    set(value) {
      this.setDataValue('images', Array.isArray(value) ? value.join(';') : value);
    }
  },
  userId: { // Campo para la relación con User
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id'
    }
  },
  categoryId: { // Campo para la relación con Category
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Category,
      key: 'id'
    }
  }
}, {
  timestamps: true,
  getterMethods: {
    toJSON() {
      const values = { ...this.dataValues };
      // Eliminamos campos técnicos y foreign keys
      delete values.createdAt;
      delete values.updatedAt;
      delete values.userId;
      delete values.categoryId;
      return values;
    }
  }
});

User.hasMany(Product);
Product.belongsTo(User);
Category.hasMany(Product);
Product.belongsTo(Category);

Product.sync({ force: false })
  .then(() => {
    console.log('Tabla de Products creada correctamente.');
  })
  .catch(err => {
    console.error('Error al crear la tabla de Products:', err);
  });


module.exports = Product;