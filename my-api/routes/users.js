var express = require('express');
var router = express.Router();

const { getAllUsers } = require('../mysql/get/users');

/* POST users listing. */
router.post('/', async function(req, res, next) {
    console.log(req.body);

    let users = await getAllUsers();

    //res.header("Access-Controll-Allow-Origin", 'http://localhost:5173');
    res.json(data);
});

module.exports = router;
