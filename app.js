require('dotenv').config()
const express = require("express");
const ejs = require("ejs");
const bodyParser = require('body-parser')
const mongoose = require("mongoose");
const User = require("./models/userDB.js");
const encrypt = require('mongoose-encryption');


const app = express();
app.use(express.static("public"));
app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({
    extended : true
}));

 
mongoose.connect(process.env.MONGOOSE_API, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
})

mongoose.connection.on('connected', () => {
    console.log('Mongoose is connected!!!!');
});


app.get('/', function(req, res){
    res.render('home')
});
app.get('/register', function(req, res){
    res.render('register')
});

app.get('/login', function(req, res){
    res.render("login")
});

app.post('/register', function(req, res){
    const newUser = new User({
        email : req.body.username,
        password : req.body.password
    })
    newUser.save(function(err){
        if (err){
            console.log(err)
        } else {
            res.render("secrets")
        }
    })
})
app.post('/login', function(req, res){
    const username = req.body.username;
    const password = req.body.password;
    User.findOne({email : username}, function(err, founduser){
        if (err){
            console.log(err)
        } else {
            if (founduser){
                if (founduser.password===password){
                    res.render("secrets")
                } else {
                    res.send("User Not Found")
                }
            }
        }
    })
})


app.listen(3000, function(){
    console.log("server listening on port 3000")
})