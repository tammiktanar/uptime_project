var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
const { createReservation } = require('../../mysql/create/reservations');



/* POST users listing. */
router.post('/', async function(req, res, next) {
    console.log(req.body);
    res.header('Access-Control-Allow-Origin', process.env.PUBLIC_SITE_HTTP+'://'+process.env.PUBLIC_SITE_IP+':'+process.env.PUBLIC_SITE_PORT)
    res.header("Access-Control-Allow-Credentials", "true")

    if (!req.body.firstName) {
        res.status(500).json({success: false, error: true, message: "Missing first name", data: req.body})
        return 
    } else if (req.body.firstName.length >= 200) {
        res.status(500).json({success: false, error: true, message: "First name is too long", data: req.body})
        return
    }

    if (!req.body.lastName) {
        res.status(500).json({success: false, error: true, message: "Missing last name", data: req.body})
        return 
    } else if (req.body.lastName.length >= 200) {
        res.status(500).json({success: false, error: true, message: "Last name is too long", data: req.body})
        return
    }

    if (!req.body.route) {
        res.status(500).json({success: false, error: true, message: "Missing route", data: req.body})
        return 
    }

    // Create route validation check


    let validUntilCheck = true
    let validUntil

    req.body.route.forEach((route, index) => { // Get the earliest validDate
        if (index == 0) {
            validUntil = new Date(route.validUntil)
        }

        if (route.validUntil === undefined) validUntilCheck = false;

        let cur_validDate =  new Date(route.validUntil);

        if (cur_validDate == 'Invalid Date') validUntilCheck = false;

        if (cur_validDate < validUntil) validUntil = cur_validDate;
    });

    validUntil = new Date(new Date(validUntil).setHours(new Date(validUntil).getHours()+2)).toISOString().slice(0, 19).replace('T', ' ');

    if (!validUntilCheck) {
        res.status(500).json({success: false, error: true, message: "Missing validUntil", data: req.body})
        return 
    }

    try {
        
        await createReservation({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            route: JSON.stringify(req.body.route),
            validUntil: validUntil,
        });
    
        res.send({success: true, error: false, message: "Reservation created", data: null})

    } catch(error) {
        res.status(500).json({success: false, error: true, message: "Error with db createReservation", data: error})
    }
});

module.exports = router;
