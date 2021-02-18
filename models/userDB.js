require('dotenv').config()
const mongoose = require("mongoose");
const passport = require('passport');
const passportLocalMongoose = require("passport-local-mongoose")
const findOrCreate = require('mongoose-findorcreate')

const userSchema = new mongoose.Schema({
    username : {
        type: String
    },
    googleId : {
        type: String
    },
    password: {
        type: String
    },
    secrets: {
      type : String
    }
})
userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate)
const User = mongoose.model('user', userSchema);
passport.use(User.createStrategy());

passport.serializeUser(function(user, done) {
    done(null, user.id);
  });
  
  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });
module.exports = User;