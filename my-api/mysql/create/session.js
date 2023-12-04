var mysql = require("mysql2/promise");
const { db_info } = require("../db");
const { getUserWithId } = require("../get/users");

async function addSession(user, token) {
    let con = await mysql.createConnection(db_info)

    let sql = "INSERT INTO `sessions` (`session_key`, `user_id`, `create`) VALUES (?,?,?);" 
    let time = 0
    
    con.execute(
        sql,
        [
            token,
            user.id,
            time
        ]
    );
} 


module.exports = { addSession };