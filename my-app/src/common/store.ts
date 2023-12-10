export interface Company {
    id: string;
    name: string;
}

export interface Provider {
    id: string;
    company: Company;
    price: number;
    flightStart: string;
    flightEnd: string;
}

export interface Planet {
    id: string;
    name: string;
}

export interface RouteInfo {
    id: string;
    from: Planet;
    to: Planet;
    distance: number;
}

export interface Route {
    id: string;
    routeInfo: RouteInfo;
    validUntil: string;
    providers: Provider[];
}

export interface Data {
    pricelist: Route[];
}

export interface Reservation {
    id: number,
    validDate: string,
    route: Route[];
    firstName: string,
    lastName: string,
    userID: number
}
