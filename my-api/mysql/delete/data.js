var mysql = require("mysql2/promise");
const { db_info } = require("../db");


async function deleteRoute(id) {
    let con = await mysql.createConnection(db_info)

    let sql = "DELETE FROM route WHERE `id` = ?" 

    con.execute(
        sql,
        [
            id
        ]
    );
    
    deleteProvidersRouteId(id)
    deleteRouteInfoRouteId(id)
} 

async function deleteProvidersRouteId(id) {
    let con = await mysql.createConnection(db_info)

    let sql = "DELETE FROM providers WHERE `providers`.`route_id` = ?" 

    con.execute(
        sql,
        [
            id
        ]
    );
} 

async function deleteRouteInfoRouteId(id) {
    let con = await mysql.createConnection(db_info)

    let sql = "DELETE FROM routeinfo WHERE `routeinfo`.`route_id` = ?" 

    con.execute(
        sql,
        [
            id
        ]
    );
} 


module.exports = { deleteRoute };