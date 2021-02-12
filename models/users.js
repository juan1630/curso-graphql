const mongoose = require('mongoose');


// model of users 

const UsuarioSchema = mongoose.Schema({
    name: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, unique: true },
    password: { type: String, required: true, trim: true },
    date: { type: Date, default: Date.now() }
});


module.exports = mongoose.model('User', UsuarioSchema);