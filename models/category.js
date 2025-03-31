const { Schema, model } = require('mongoose');

const CategorySchema = Schema({
    name: {
        type: String,
        required: [true, 'El nombre de la categoría es obligatorio'],
        unique: true
    },
    state: {
        type: Boolean,
        default: true
    },

});

CategorySchema.methods.toJSON = function () {
    const { __v, state, ...categoryObject } = this.toObject();
    return categoryObject;
}

module.exports = model('Category', CategorySchema);
