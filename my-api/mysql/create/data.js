var mysql = require("mysql2/promise");
const { db_info } = require("../db");
const { getCompanyWithId, getRouteWithId, getRouteInfoWithId, getProviderWithId } = require("../get/data");

async function createData(data) {
    data.legs.forEach(async route => {
        await createRouteInfo(route.routeInfo, route.id)
        route.providers.forEach(async provider => {
            await createProvider(provider, route.id)
        })

        let existingRoute = await getRouteWithId(route.id)
        if (existingRoute.length != 0) return

        let con = await mysql.createConnection(db_info)

        let sql = "INSERT INTO `route`(`id`, validUntil) VALUES (?,?)"

        await con.execute(
            sql,
            [
                route.id,
                data.validUntil
            ]
        );

        con.end()


    });
} 

async function createRouteInfo(routeInfo, routeId) {
    let existingRoute = await getRouteInfoWithId(routeInfo.id)
    if (existingRoute.length != 0) return

    let con = await mysql.createConnection(db_info)

    let sql = "INSERT INTO `routeinfo`(`id`, `route_id`, `from`, `to`, `distance`) VALUES (?,?,?,?,?)" 

    await con.execute(
        sql,
        [
            routeInfo.id,
            routeId,
            JSON.stringify(routeInfo.from),
            JSON.stringify(routeInfo.to),
            routeInfo.distance
        ]
    );

    con.end()
}

async function createProvider(provider, routeId) {
    let existingRoute = await getProviderWithId(provider.id)
    if (existingRoute.length != 0) return

    let con = await mysql.createConnection(db_info)

    let sql = "INSERT INTO `providers`(`id`, `company_id`, `route_id`, `flightStart`, `flightEnd`, `price`) VALUES (?,?,?,?,?,?)" 

    await con.execute(
        sql,
        [
            provider.id,
            provider.company.id,
            routeId,
            provider.flightStart,
            provider.flightEnd,
            provider.price
        ]
    );
    
    con.end()

    createCompany(provider.company)
}

async function createCompany(company) {
    let existingCompany = await getCompanyWithId(company.id)
    if (existingCompany.length != 0) {
        if (existingCompany.name == company.name) return
    }

    let con = await mysql.createConnection(db_info)

    let sql = "INSERT INTO `company` (`id`, `name`) VALUES (?,?);" 

    await con.execute(
        sql,
        [
            company.id,
            company.name
        ]
    );
    
    con.end()
}


module.exports = { createData };