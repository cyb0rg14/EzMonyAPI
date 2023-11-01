import mongoose from "mongoose"


const UserSchema = new mongoose.Schema({
    profilePicture: {
        type: String,
        default: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
    },
    fullname: {
        type: String,
        required: true
    },
    profileSummary: {
        type: String,
        default: null
    },
    email: {
        type: String,
        required: true,
        unique: true,
        // match: /^[a-zA-Z0-9._-]+@[a-zA-Z.-]+\.[a-zA-Z]{2,4}$/
    },
    phone: {
        type: String,
        default: null
    },
    experience: {
        type: String,
        default: "fresher"
    },
    availabilityToJoin: {
        type: String,
        default: "More than 3 Months"
    },
    resume: {
        type: String,
        default: null
    },
    keySkills: {
        type: Array,
        default: []
    },

})

export default mongoose.model('User', UserSchema)