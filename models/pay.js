const { Schema, model } = require('mongoose');

const PaySchema = Schema({
    // Número de pago, que se incrementará automáticamente
    numberpay: {
        type: String,
        required: true,
        unique: true // Debe ser único
    },
    amountpay: {
        type: Number,
        required: true,
        default: 0
    },
    date: {
        type: Date,
        default: Date.now
    },
    state: {
        type: Boolean,
        default: true 
    },
});

// Hook para generar un número de pago secuencial
PaySchema.pre('save', async function (next) {
    const lastPay = await this.constructor.findOne().sort({ numberpay: -1 });
    
    // Convertimos numberpay a número antes de incrementar
    const lastNumber = lastPay ? Number(lastPay.numberpay) : 0;

    // Incrementamos el número de pago
    this.numberpay = (lastNumber + 1).toString(); // Convertimos a string para guardar

    next();
});

PaySchema.methods.toJSON = function () {
    const { __v, state, ...payObject } = this.toObject();
    return payObject;
}

module.exports = model('Pay', PaySchema);
