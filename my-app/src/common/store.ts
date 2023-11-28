export interface Company {
    id: string;
    name: string;
}

export interface Provider {
    id: string;
    company: Company;
    price: Number;
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
}

export interface Route {
    id: string;
    routeInfo: RouteInfo;
    providers: Provider[];
}

export interface Data {
    id: string;
    validUntil: string;
    legs: Route[];
}
