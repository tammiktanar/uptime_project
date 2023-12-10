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

        con.query('SET GLOBAL max_connections = 1024;', function (error, results) {
            if (error) {
                mysql_error(err)
            } else {
                mysql_log('Database connections increased');
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


        sql = "CREATE TABLE IF NOT EXISTS `reservations`" + 
        "(" +
            "`id` INT(11) NOT NULL AUTO_INCREMENT ," + 
            "`validUntil` DATETIME NOT NULL ," + 
            "`route` JSON NOT NULL ," + 
            "`firstName` VARCHAR(255) NOT NULL ," + 
            "`lastName` VARCHAR(255) NOT NULL ," + 
            "`userID` INT NULL ," + 
            "PRIMARY KEY (`id`)" + 
        ");"

        con.query(
            sql, 
            function (err, result) {
                if (err) {
                    mysql_error(err)
                } else {
                    mysql_log("Table `reservations` created");
                }
            }
        );

        sql = "CREATE TABLE IF NOT EXISTS `route` "+
        "("+
            "`id` VARCHAR(255) NOT NULL ,"+
            "`validUntil` VARCHAR(255) NOT NULL "+
        ")"

        con.query(
            sql, 
            function (err, result) {
                if (err) {
                    mysql_error(err)
                } else {
                    mysql_log("Table `route` created");
                }
            }
        );

        sql = "CREATE TABLE IF NOT EXISTS `routeinfo` "+
        "("+
            "`id` VARCHAR(255) NOT NULL ,"+
            "`route_id` VARCHAR(255) NOT NULL ,"+
            "`from` JSON NOT NULL ,"+
            "`to` JSON NOT NULL ,"+
            "`distance` BIGINT(20) NOT NULL "+
        ")"

        con.query(
            sql, 
            function (err, result) {
                if (err) {
                    mysql_error(err)
                } else {
                    mysql_log("Table `routeinfo` created");
                }
            }
        );

        sql = "CREATE TABLE IF NOT EXISTS `providers` "+
        "("+
            "`id` VARCHAR(255) NOT NULL ,"+
            "`company_id` VARCHAR(255) NOT NULL ,"+
            "`route_id` VARCHAR(255) NOT NULL ,"+
            "`flightStart` VARCHAR(255) NOT NULL ,"+
            "`flightEnd` VARCHAR(255) NOT NULL ,"+
            "`price` INT NOT NULL "+
        ")"

        con.query(
            sql, 
            function (err, result) {
                if (err) {
                    mysql_error(err)
                } else {
                    mysql_log("Table `providers` created");
                }
            }
        );

        sql = "CREATE TABLE IF NOT EXISTS `company` (`id` VARCHAR(255) NOT NULL , `name` VARCHAR(255) NOT NULL )"

        con.query(
            sql, 
            function (err, result) {
                if (err) {
                    mysql_error(err)
                } else {
                    mysql_log("Table `company` created");
                }
            }
        );

        con.end()
    })
}


module.exports = { initDb, db_info };