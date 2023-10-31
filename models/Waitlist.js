// import mongoose from "mongoose";
const mongoose = require('mongoose')


const WaitlistSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        match: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    }
})

// export default mongoose.model("Waitlist", WaitlistSchema)
module.exports = mongoose.model("Waitlist", WaitlistSchema)