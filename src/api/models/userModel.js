const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true

    },
    lastname: {
        type: String,
        trim: true

    },
    username: {
        type: String,
        unique: [true, 'This username is already used.'],
        trim: true

    },
    email: {
        type: String,
        unique: [true, 'This email is already used.'],
    },
    password: {
        type: String,
    },
    createdAt: {
        type: Date,
        default: new Date(),
    },
    admin: {
        type: Boolean,
        default: false
    }
})


const User = new mongoose.model('User', userSchema);
module.exports = User
