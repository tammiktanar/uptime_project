var mysql = require("mysql2")
const { mysql_log, mysql_error } = require("../logging")

const db_info_start = {
    host: process.env.PRIVATE_DB_HOST,
    user: process.env.PRIVATE_DB_USER,
    port: process.env.PRIVATE_DB_PORT,
    password: process.env.PRIVATE_DB_PASS
}

const db_info = {
    database: process.env.PRIVATE_DB_DATABASE,
    ...db_info_start
}

function initDb() {
    let con = mysql.createConnection(db_info_start)


    con.connect(function(err) {
        if (err) mysql_error(err);
        mysql_log("Connected");
    
        con.query("CREATE DATABASE IF NOT EXISTS " + db_info.database + ";", function (err, result) {
            if (err) {
                mysql_error(err)
            } else {
                mysql_log("Database created");
            }
        });

        con.query('USE ' + db_info.database + ';', function (error, results) {
            if (error) {
                mysql_error(err)
            } else {
                mysql_log('Database connected');
            }
        });

        let sql = "CREATE TABLE IF NOT EXISTS `users`" +
            " ( " +
            "    `id` int(11) NOT NULL AUTO_INCREMENT,"+
            "    `username` varchar(255) NOT NULL,"+
            "    `password` varchar(255) NOT NULL,"+
            "    `email` varchar(255) NOT NULL,"+
            "    PRIMARY KEY (`id`)"+
            " ) "

        con.query(
            sql, 
            function (err, result) {
                if (err) {
                    mysql_error(err)
                } else {
                    mysql_log("Table `users` created");
                }
            }
        );

        sql = "CREATE TABLE IF NOT EXISTS `sessions`"+
        " ( "+
        "    `session_key` VARCHAR(255) NOT NULL, "+
        "    `user_id` INT(11) NOT NULL, "+
        "    `created` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP "+
        " ) "

        con.query(
            sql, 
            function (err, result) {
                if (err) {
                    mysql_error(err)
                } else {
                    mysql_log("Table `sessions` created");
                }
            }
        );
        


        con.end()
    })
}


module.exports = { initDb, db_info };