var express = require('express');
var router = express.Router();
const { getAllReservations } = require('../../mysql/get/reservations');
const { createData } = require('../../mysql/create/data');
const { getData } = require('../../mysql/get/data');


/* POST users listing. */
router.get('/', async function(req, res, next) {
    console.log(req.body);
    res.header('Access-Control-Allow-Origin', process.env.PUBLIC_SITE_HTTP+'://'+process.env.PUBLIC_SITE_IP+':'+process.env.PUBLIC_SITE_PORT)
    res.header("Access-Control-Allow-Credentials", "true")

    let pricelist = await fetch("https://cosmos-odyssey.azurewebsites.net/api/v1.0/TravelPrices").then(async (res) => {
        return await res.json();
    })

    if (pricelist.legs !== undefined) {
        createData(pricelist)
    }  

    let saved_pricelist = await getData()

    try {
        //const pricelist = await getAllReservations(claims.id);
        
        res.json({success: true, error: false, message: "Obtained pricelist", data: {'pricelist': saved_pricelist}})
    } catch(error) {
        res.status(500).json({success: false, error: true, message: "database error", data: error})
    }
});

module.exports = router;
