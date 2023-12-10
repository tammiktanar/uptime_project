var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
const { getUserWithId } = require('../mysql/get/users');


/* POST users listing. */
router.get('/', async function(req, res, next) {
    console.log(req.body);
    res.header('Access-Control-Allow-Origin', process.env.PUBLIC_SITE_HTTP+'://'+process.env.PUBLIC_SITE_IP+':'+process.env.PUBLIC_SITE_PORT)
    res.header("Access-Control-Allow-Credentials", "true")

    const cookie = req.cookies['token']

    try {
        const claims = jwt.verify(cookie, process.env.PRIVATE_SECRET);
        if (!claims) res.status(401).json({success: false, error: true, message: "No auth", data: null})

        const user = await getUserWithId(claims.id);

        if (user.length == 0) {
            res.status(500).json({success: false, error: true, message: "No auth", data: null})
            return 
        }

        res.json({success: true, error: false, message: "Authorized", data: user[0]})
    } catch(error) {
        res.status(500).json({success: false, error: true, message: "jwt error", data: error})
    }
});

module.exports = router;
