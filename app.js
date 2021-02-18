require('dotenv').config()
const express = require("express");
const ejs = require("ejs");
const bodyParser = require('body-parser')
const mongoose = require("mongoose");
const User = require("./models/userDB.js");
const passport = require('passport');
const session = require('express-session');
const passportLocalMongoose = require("passport-local-mongoose")

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

app.get('/login', function(req, res){
    if (req.isAuthenticated()){
        res.render('secrets')
    } else {
        res.render("login")
    }
});

app.get("/secrets", (req, res)=>{
    if (req.isAuthenticated()){
        res.render('secrets')
    } else {
        res.send("not authenticated")
 //       res.redirect('/login')
    }
})

app.get('/logout', function(req, res){
    req.logout();
    res.redirect('/');
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
                                   failureRedirect: '/login'
                                })
);


app.listen(3000, function(){
    console.log("server listening on port 3000")
})