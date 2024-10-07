const { Schema, model } = require('mongoose');

const ClientSchema = Schema({ 
    dni: {//documento de idenctidad
        type: String,
        required: [true, 'El documento de identidad es obligatorio'],
        unique: true
    },
    name: {
        type: String,
        required: [true, 'El nombre es obligatorio'],
    },
    gmail: {
        type: String,
        required: [true, 'El correo es obligatorio'],
    },
    state: {
        type: Boolean,
        default: true
    },    
    gmail: {
        type: String,
        required: [true, 'El correo es obligatorio'],
    },
});



UserSchema.methods.toJSON = function () {    
    const { __v, password, _id, ...userObject} = this.toObject();
    userObject.uid = _id;
    return userObject;
}


module.exports = model('User', UserSchema);