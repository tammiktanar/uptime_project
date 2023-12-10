var mysql = require("mysql2/promise");
const { db_info } = require("../db");
const { deleteReservation } = require("../delete/reservations");


async function getAllReservations() {
    let con = await mysql.createConnection(db_info)

    let sql = "SELECT * FROM `reservations`"

    let [reservations] = await con.execute(
        sql
    );

    let todaysDate = new Date()

    reservations = reservations.filter(reservation => {
        if (reservation.validUntil == null || reservation.validUntil == 'Invalid Date') {
            deleteReservation(reservation.id)
            return false
        }
        
        let reservationDate = new Date(reservation.validUntil)

        if (todaysDate > reservationDate) {
            deleteReservation(reservation.id)
            return false
        }

        return true
    })
    if (reservations.length == 0) {
        reservations = []
    }
    return reservations
}

module.exports = { getAllReservations };