var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt');
const { getUserWithEmail } = require('../mysql/get/users');


/* POST users listing. */
router.post('/', async function(req, res, next) {
    console.log(req.body);

    if (!req.body.email) {
        res.status(500).json({success: false, error: true, message: "Missing email", data: req.body})
        return 
    }

    if (!req.body.password) {
        res.status(500).json({success: false, error: true, message: "Missing password", data: req.body})
        return 
    }

    try {
        const users = await getUserWithEmail(req.body.email);

        if (users.length == 0) {
            res.status(500).json({success: false, error: true, message: "No user with that email", data: req.body})
            return 
        }
    
    
        if (users[0]["id"]) {
            const user = users[0]

            if (!await bcrypt.compare(req.body.password, user.password)) {
                res.status(500).json({success: false, error: true, message: "Invalid password", data: req.body})
                return
            }


            res.json({success: true, error: false, message: "User logged in", data: user})
        }

    } catch(error) {
        res.status(500).json({success: false, error: true, message: "Error with db login", data: error})
    }
});

module.exports = router;
