var mysql = require("mysql2/promise");
const { db_info } = require("../db");
const { getUserWithId } = require("../get/users");

async function registerUser(newUser) {
    let con = await mysql.createConnection(db_info)

    let sql = "INSERT INTO `users` (`username`, `password`, `email`) VALUES (?,?,?);" 

    con.execute(
        sql,
        [
            newUser.username,
            newUser.password,
            newUser.email
        ]
    );


    sql = "SELECT LAST_INSERT_ID() as id;";
    
    const [data] = await con.execute(sql);
    await con.end()

    if (data[0]["id"]) {
        const users = await getUserWithId(data[0]["id"])

        return users
    } 
    
    throw new Error("Failed insert")
} 


module.exports = { registerUser };