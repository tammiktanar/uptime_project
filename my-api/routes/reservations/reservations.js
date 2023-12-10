var express = require('express');
var router = express.Router();
const { getAllReservations } = require('../../mysql/get/reservations');


/* POST users listing. */
router.get('/', async function(req, res, next) {
    console.log(req.body);
    res.header('Access-Control-Allow-Origin', process.env.PUBLIC_SITE_HTTP+'://'+process.env.PUBLIC_SITE_IP+':'+process.env.PUBLIC_SITE_PORT)
    res.header("Access-Control-Allow-Credentials", "true")

    
    try {
        const reservations = await getAllReservations();

        res.json({success: true, error: false, message: "Obtained reservations", data: {'reservations': reservations}})
    } catch(error) {
        res.status(500).json({success: false, error: true, message: "jwt error", data: error})
    }
});

module.exports = router;
