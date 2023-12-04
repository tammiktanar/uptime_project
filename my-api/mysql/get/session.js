var mysql = require("mysql2/promise");
const { db_info } = require("../db");


async function getSessionWithSessionId(sessionKey) {
    let con = await mysql.createConnection(db_info)

    let sql = "SELECT * FROM `sessions` WHERE session_key = ?"

    const [sessions] = await con.execute(
        sql,
        [sessionKey]
    );

    if (sessions.length != 0) {
        const session = sessions[0]

        if (session) { // check if session expired
            if (session.created) {
                
            }
        }
    }

    return sessions
}




module.exports = { getSessionWithSessionId };