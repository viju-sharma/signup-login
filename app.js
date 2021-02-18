require('dotenv').config()
const express = require("express");
const ejs = require("ejs");
const bodyParser = require('body-parser')
const mongoose = require("mongoose");
const User = require("./models/userDB.js");
const passport = require('passport');
const session = require('express-session');
const passportLocalMongoose = require("passport-local-mongoose")
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { compareSync } = require('bcrypt');
const app = express();


app.use(express.static("public"));
app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({
    extended : true
}));

//config express-session
app.use(session({
  secret: 'thisismylittlesecret',
  resave: false,
  saveUninitialized: true
}))

//config passport

app.use(passport.initialize());
app.use(passport.session());

//Google Strategy config
passport.use(new GoogleStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/secrets"
  },
  function(accessToken, refreshToken, profile, cb) {
      User.findOrCreate({ googleId: profile.id }, function (err, user) {
          return cb(err, user);
    });
  }
));

// mongoose deprecation warnings
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

 
mongoose.connect(process.env.MONGOOSE_API, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
})

mongoose.connection.on('connected', () => {
    console.log('Mongoose is connected!!!!');
});


app.get('/', function(req, res){
    if (req.isAuthenticated()){
        res.render("secrets")
    } else {
        res.render('home')
    }
});
app.get('/register', function(req, res){
    if (req.isAuthenticated()){
        res.render('secrets')
    } else {
        res.render('register')
    }
});
app.get('/login-incorrect', function(req, res){
    if (req.isAuthenticated()){
        res.render('secrets')
    } else {
        res.render("login_!auth")
    }
});
app.get('/login', function(req, res){
    if (req.isAuthenticated()){
        res.render('secrets')
    } else {
        res.render("login")
    }
});


app.get('/submit', function(req, res){
    if (req.isAuthenticated()){
        res.render('submit')
    } else {
        res.render("login")
    }
});

app.get("/secrets", (req, res)=>{
    User.find({"secrets" : {$ne:null}}, function(err, foundUser){
        if (err){
            console.log(err)
        } else {
            if (foundUser){
                console.log(foundUser)
                res.render("secrets", {userSecrets : foundUser});
            }
        }
    })
})

app.get('/logout', function(req, res){
    req.logout();
    res.redirect('/');
  });


app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile'] })
  );

app.get('/auth/google/secrets', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect secret.
    res.redirect('/secrets');
  });

app.post('/register', function(req, res){
    User.register({username:req.body.username}, req.body.password, function(err, user) {
        if (err) {
            console.log(err)
            res.redirect('/register')
        } else {
             passport.authenticate("local")(req, res, function() {
                res.redirect('/secrets')
                });
        }
      
        ;
      });
})

app.post('/login',
  passport.authenticate('local', { successRedirect: '/secrets',
                                   failureRedirect: '/login-incorrect'
                                })
);

app.post('/submit', function(req, res){
    const secret = req.body.secret;
    console.log(req.user)
    User.findByIdAndUpdate(req.user._id, {"secrets" : secret}, function(err){
        if (err){
            console.log(err)
        } else {
            res.redirect('secrets')
        }
    })
})

app.listen(3000, function(){
    console.log("server listening on port 3000")
})