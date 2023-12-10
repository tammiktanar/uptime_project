var mysql = require("mysql2/promise");
const { db_info } = require("../db");

async function createReservation(newReservation) {
    let con = await mysql.createConnection(db_info)

    let sql = "INSERT INTO `reservations` (`firstName`, `lastName`, `route`, `validUntil`) VALUES (?,?,?,?);" 

    con.execute(
        sql,
        [
            newReservation.firstName,
            newReservation.lastName,
            newReservation.route,
            newReservation.validUntil,
        ]
    );
    
    con.end()
} 


module.exports = { createReservation };