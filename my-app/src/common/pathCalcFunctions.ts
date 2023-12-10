import type { Company, Data, Provider, Route } from "./store"

export function getRoutesWithStartOf(data:Data, start: String, excludedRoutes: Route[]) { // Gets all routes with from set to the starting planet name requested
    let res: Route[] = []

    data.pricelist.forEach(route => {
        if (!excludedRoutes.some(check_route => check_route.routeInfo.id == route.routeInfo.id)) {
            if (route.routeInfo.from.name == start) {
                res.push(route)
            }
        }
    })

    return res
}


export function validatePath(possiblePath: Route[], startPlanet: string, endPlanet:string) {
    if (possiblePath.length != 0) {
        if (possiblePath[0].routeInfo.from.name != startPlanet) return false; // Check if starting planet is the correct one
        if (possiblePath[possiblePath.length - 1].routeInfo.to.name != endPlanet) return false; // Check if the ending planet is the correct one

        let revisited_check = false
        let no_providers = false

        possiblePath.forEach((route, i_index) => { // Check if the route has revisited any planets
            if (possiblePath.some((check_route, k_index) => {
                if (i_index == k_index) return false;

                if (check_route.routeInfo.from.name == route.routeInfo.from.name) {
                    return true
                } else if (check_route.routeInfo.from.name == route.routeInfo.from.name) {
                    return true
                } else {
                    return false
                }

            })) {
                revisited_check = true
            }

            if (route.providers.length == 0) {
                no_providers = true
            }
        });

        if (revisited_check) return false
        if (no_providers) return false

        return true
    } else {
        return false
    }
}



export function validateSortedPath(possiblePath: Route[], departAtDate: string, arriveByDate: string, requestedPrice: number, requestedDistance: number) {
    let traveledDistance = 0
    let travelPrice = 0

    let dateCheck = true
    let curPlanetEndTime = new Date(departAtDate).getTime()
    let requestedEndTime = new Date(arriveByDate).getTime()

    for (let route of possiblePath) {
        if (!dateCheck) return

        traveledDistance += route.routeInfo.distance

        if (route.providers[0] && route.providers.length == 1) {
            travelPrice += route.providers[0].price
        }

        let newPlanetflightStart = new Date(route.providers[0].flightStart).getTime()
        let newPlanetflightEnd= new Date(route.providers[0].flightEnd).getTime()


        if (curPlanetEndTime > newPlanetflightStart) { dateCheck = false}
        if (requestedEndTime < newPlanetflightEnd) { dateCheck = false} 

        curPlanetEndTime = newPlanetflightEnd

    }

    if (requestedPrice <= travelPrice) return false;
    if (requestedDistance <= traveledDistance) return false;
    if (!dateCheck) return false;
    
    return true
}

export function checkDistance(possiblePath: Route[], requestedDistance: number) { // Checks to see if the route is longer than requested
    let cur_distance = 0
    let res = true

    possiblePath.forEach((route: Route) => {
        cur_distance += route.routeInfo.distance
    })

    if (cur_distance > requestedDistance) {
        res = false
    }

    return res
}

export function removeUnwantedCompanies(route: Route, excludeCompanies: string[], departAtDate:string, arriveByDate:string) {
    let requestedDepartureTime = new Date(departAtDate)
    let requestedArrivalTime = new Date(arriveByDate)

    route.providers = route.providers.filter((provider: Provider) => {
        if (excludeCompanies.some(companyName => companyName == provider.company.name)) return false;
        let newPlanetDepartTime = new Date(provider.flightStart)
        let newPlanetArrivalTime = new Date(provider.flightEnd)

        if (requestedDepartureTime > newPlanetDepartTime) return false;
        if (requestedArrivalTime < newPlanetArrivalTime) return false;


        return true 
    })

    return route
}
