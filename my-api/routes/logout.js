var express = require('express');
var router = express.Router();

/* POST users listing. */
router.post('/', function(req, res, next) {
    console.log(req.body);
    res.header('Access-Control-Allow-Origin', process.env.PUBLIC_SITE_HTTP+'://'+process.env.PUBLIC_SITE_IP+':'+process.env.PUBLIC_SITE_PORT)
    res.header("Access-Control-Allow-Credentials", "true")
    
    res.cookie('token', {httpOnly: true, maxAge: 0})
    res.send({success: true, error: false, message: "Logged out", data: null})


});

module.exports = router;
