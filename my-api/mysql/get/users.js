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

async function getUserWithId() {
    let con = await mysql.createConnection(db_info)

    let sql = "SELECT id, username, email FROM `users`"

    const [users] = await con.execute(
        sql
    );

    return users
}

async function getUserWithUsername() {
    let con = await mysql.createConnection(db_info)

    let sql = "SELECT id, username, email FROM `users`"

    const [users] = await con.execute(
        sql
    );

    return users
}

async function getUserWithEmail() {
    let con = await mysql.createConnection(db_info)

    let sql = "SELECT id, username, email FROM `users`"

    const [users] = await con.execute(
        sql
    );

    return users
}

module.exports = { getAllUsers, getUserWithId, getUserWithUsername, getUserWithEmail };