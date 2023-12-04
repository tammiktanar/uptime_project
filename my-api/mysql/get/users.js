var mysql = require("mysql2/promise");
const { db_info } = require("../db");


async function getAllUsers() {
    let con = await mysql.createConnection(db_info)

    let sql = "SELECT id, username, email FROM `users`"

    const [users] = await con.execute(
        sql
    );

    return users
}

async function getUserWithId(id) {
    let con = await mysql.createConnection(db_info)

    let sql = "SELECT id, username, email FROM `users` WHERE id = ?"

    const [users] = await con.execute(
        sql,
        [id]
    );

    return users
}


async function getUserWithEmail(email) {
    let con = await mysql.createConnection(db_info)

    let sql = "SELECT id, username, email, password FROM `users` WHERE email = ?"

    const [users] = await con.execute(
        sql,
        [email]
    );

    return users
}

module.exports = { getAllUsers, getUserWithId, getUserWithEmail };