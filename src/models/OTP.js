// import mongoose from "mongoose"
const mongoose = require('mongoose')

const OTPSchema = new mongoose.Schema({
    otp: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true,
        unique: true,
        // match: /^[a-zA-Z0-9._-]+@[a-zA-Z.-]+\.[a-zA-Z]{2, 4}$/
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    expiresAt: {
        type: Date,
        default: function() {
            return new Date(Date.now() + 5 * 60 * 1000)
        }
    }
})

// export default mongoose.model('OTP', OTPSchema)
module.exports = mongoose.model('OTP', OTPSchema)