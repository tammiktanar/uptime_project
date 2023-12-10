var mysql = require("mysql2/promise");
const { db_info } = require("../db");

async function deleteReservation(id) {
    let con = await mysql.createConnection(db_info)

    let sql = "DELETE FROM reservations WHERE `reservations`.`id` = ?" 

    con.execute(
        sql,
        [
            id
        ]
    );
} 


module.exports = { deleteReservation };