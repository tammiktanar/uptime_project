var mysql = require("mysql2/promise");
const { db_info } = require("../db");
const { deleteRoute } = require("../delete/data");


async function getAllCompanies() {
    let con = await mysql.createConnection(db_info)

    let sql = "SELECT * FROM `company`"

    const [companies] = await con.execute(
        sql
    );
    con.end()

    return companies
}

async function getCompanyWithId(id) {
    let con = await mysql.createConnection(db_info)

    let sql = "SELECT * FROM `company` WHERE id = ?"

    const [company] = await con.execute(
        sql,
        [id]
    );
    con.end()

    return company
}

async function getAllRoutes() {
    let con = await mysql.createConnection(db_info)

    let sql = "SELECT * FROM `route`"

    const [route] = await con.execute(
        sql,
    );
    con.end()

    return route
}

async function getRouteWithId(id) {
    let con = await mysql.createConnection(db_info)

    let sql = "SELECT * FROM `route` WHERE id = ?"

    const [route] = await con.execute(
        sql,
        [id]
    );
    con.end()

    return route
}

async function getRouteInfoWithId(id) {
    let con = await mysql.createConnection(db_info)

    let sql = "SELECT * FROM `routeinfo` WHERE id = ?"

    const [routeInfo] = await con.execute(
        sql,
        [id]
    );
    con.end()

    return routeInfo
}

async function getRouteInfoWithRouteId(id) {
    let con = await mysql.createConnection(db_info)

    let sql = "SELECT * FROM `routeinfo` WHERE route_id = ?"

    const [routeInfo] = await con.execute(
        sql,
        [id]
    );
    con.end()

    return routeInfo
}

async function getProviderWithId(id) {
    let con = await mysql.createConnection(db_info)

    let sql = "SELECT * FROM `providers` WHERE id = ?"

    const [provider] = await con.execute(
        sql,
        [id]
    );

    
    con.end()
    return provider
}

async function getProvidersWithRouteId(id) {
    let con = await mysql.createConnection(db_info)

    let sql = "SELECT * FROM `providers` WHERE route_id = ?"

    const [provider] = await con.execute(
        sql,
        [id]
    );

    
    con.end()
    return provider
}

async function getData() {
    let res = []

    let routes = await getAllRoutes()
    for (let route of routes) {
        route.routeInfo = await getRouteInfoWithRouteId(route.id)
        route.providers = await getProvidersWithRouteId(route.id)

        if (route.routeInfo) {
            route.routeInfo = route.routeInfo[0]
            route.routeInfo.from = JSON.parse(route.routeInfo.from)
            route.routeInfo.to = JSON.parse(route.routeInfo.to)
        }


        let formattedRoute = {
            id: route.id,
            routeInfo: route.routeInfo,
            validUntil: route.validUntil,
            providers: []
        }
        for (let provider of route.providers) {
            provider.company = await getCompanyWithId(provider.company_id)

            if (provider.company) {
                provider.company = provider.company[0]
            }
            formattedRoute.providers.push(provider)
        }

        res.push(formattedRoute)
    }

    let todaysDate = new Date()

    res = res.filter(route => {
        if (route.validUntil == null || route.validUntil == 'Invalid Date') {
            deleteRoute(route.id)
            return false
        }
        
        let routeDate = new Date(route.validUntil)

        if (todaysDate > routeDate) {
            deleteRoute(route.id)
            return false
        }

        return true
    })

    return res
}

module.exports = { getAllCompanies, getCompanyWithId, getRouteWithId,  getRouteInfoWithId, getProviderWithId, getData};