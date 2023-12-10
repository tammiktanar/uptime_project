import type { Route } from "./store";

export function sortByDistance(a:Route[], b:Route[]) {
    let a_distance = 0 
    let b_distance = 0 

    a.forEach(route =>{
        a_distance += route.routeInfo.distance
    })

    b.forEach(route =>{
        b_distance += route.routeInfo.distance
    })

    if (a_distance > b_distance) {
        return 1
    }

    if (a_distance < b_distance) {
        return -1
    }

    return 0
}

export function sortByPrice(a:Route[], b:Route[]) {
    let a_price = 0 
    let b_price = 0 

    a.forEach(route =>{
        a_price += route.providers[0].price
    })

    b.forEach(route =>{
        b_price += route.providers[0].price
    })

    if (a_price > b_price) {
        return 1
    }

    if (a_price < b_price) {
        return -1
    }

    return 0
}

export function sortByTime(a:Route[], b:Route[]) {
    let a_time = 0 
    let b_time = 0 

    a.forEach(route =>{
        a_time += Math.abs((new Date(route.providers[0].flightEnd)) - (new Date(route.providers[0].flightStart)))
    })

    b.forEach(route =>{
        b_time += Math.abs((new Date(route.providers[0].flightEnd)) - (new Date(route.providers[0].flightStart)))
    })

    if (a_time > b_time) {
        return 1
    }

    if (a_time < b_time) {
        return -1
    }

    return 0
}