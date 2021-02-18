require('dotenv').config()
const mongoose = require("mongoose");
const passport = require('passport');
const passportLocalMongoose = require("passport-local-mongoose")


const userSchema = new mongoose.Schema({
    username : {
        type: String,
        required: true
    },
    password: {
        type: String
    },
})
userSchema.plugin(passportLocalMongoose);

const User = mongoose.model('user', userSchema);
passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
module.exports = User;