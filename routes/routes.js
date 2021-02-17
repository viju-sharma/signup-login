const express = require('express');
const router = express.Router();
const User = require("../models/userDB.js")


router.route('/register').post((req, res)=> {
    const newUser = new User({
        username: req.username,
        password: req.password
    })
    newUser.save()
})






module.exports = router