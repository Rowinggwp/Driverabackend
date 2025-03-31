const { Schema, model } = require('mongoose');

const UserSchema = Schema({ 
    name: {
        type: String,
        required: [true, 'El nombre es obligatorio']
    },
    email: {
        type: String,
        required: [true, 'El correo es obligatorio'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'La Contraseña es obligatorio']
    },
    role: {
        type: String,
        required: true,
        emun: ['ADMIN_ROLE', 'USER_ROLE'],
        default: 'USER_ROLE'
    },
    state: {
        type: Boolean,
        default: true
    },    
});



UserSchema.methods.toJSON = function () {    
    const { __v, password, _id, ...userObject} = this.toObject();
    userObject.uid = _id;
    return userObject;
}


module.exports = model('User', UserSchema);