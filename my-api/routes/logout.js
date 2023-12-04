var express = require('express');
var router = express.Router();

const { getAllUsers } = require('../mysql/get/users');

/* POST users listing. */
router.post('/', function(req, res, next) {
    console.log(req.body);
    
    res.cookie('token', {httpOnly: true, maxAge: 0})
    res.send({success: true, error: false, message: "Logged out", data: null})


});

module.exports = router;
