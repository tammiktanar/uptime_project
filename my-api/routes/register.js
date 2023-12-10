var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt');

const { getUserWithEmail } = require('../mysql/get/users');
const { registerUser } = require('../mysql/create/users');

/* POST users listing. */
router.post('/', async function(req, res, next) {
    console.log(req.body);
    res.header('Access-Control-Allow-Origin', process.env.PUBLIC_SITE_HTTP+'://'+process.env.PUBLIC_SITE_IP+':'+process.env.PUBLIC_SITE_PORT)
    res.header("Access-Control-Allow-Credentials", "true")

    if (!req.body.username) {
        res.status(500).json({success: false, error: true, message: "Missing username", data: req.body})
        return 
    } else if (req.body.username.length >= 200) {
        res.status(500).json({success: false, error: true, message: "Username is too long", data: req.body})
        return
    }

    if (!req.body.email) {
        res.status(500).json({success: false, error: true, message: "Missing email", data: req.body})
        return 
    } else if (req.body.email.length >= 200) {
        res.status(500).json({success: false, error: true, message: "Email is too long", data: req.body})
        return
    } else {
        const userEmailCheck = await getUserWithEmail(req.body.email) // get list of users with the email given

        if (userEmailCheck.length != 0) {
            res.status(500).json({success: false, error: true, message: "User with that email already exists", data: req.body})
            return
        }
    }

    if (!req.body.password) {
        res.status(500).json({success: false, error: true, message: "Missing password", data: req.body})
        return 
    }


    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(req.body.password, salt)

    const newUser = {
        username: req.body.username,
        email: req.body.email,
        password: hashedPassword
    }

    try {
        const newRegister = await registerUser(newUser)
        res.json({success: true, error: false, message: "User registered", data: newRegister})
    } catch(error) {
        res.status(500).json({success: false, error: true, message: "Error with db register", data: error})
    }
});

module.exports = router;
