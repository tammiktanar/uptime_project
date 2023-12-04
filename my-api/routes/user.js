var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
const { getUserWithEmail, getUserWithId } = require('../mysql/get/users');


/* POST users listing. */
router.get('/', async function(req, res, next) {
    console.log(req.body);

    const cookie = req.cookies['token']

    try {
        const claims = jwt.verify(cookie, process.env.SECRET);
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
