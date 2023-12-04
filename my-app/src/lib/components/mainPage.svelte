<script lang="ts">
    import type { Company, Data, Planet, Provider, Route } from "../../common/store";
    import RouteDisplay from "./routeDisplay.svelte";
    
    
    export let data: Data

    let seperatedData: Data = {
        id: data.id,
        validUntil: data.validUntil,
        legs: []
    }

    let startPlanet = ""
    let endPlanet = ""

    let distanceRequested = 0

    let allStartingPlanets: Planet[] = []

    let allEndingPlanets: Planet[] = []

    let allCompanies: Company[] = []

    let excludeCompanies: string[] = []
 
    let calcPaths: Route[][] = []


    function seperateAllCompaniesIntoSeperatePaths() {


        data.legs.forEach((route:Route) => {
            let seperatedRoute:Route = {
                id: route.id,
                routeInfo: route.routeInfo,
                providers: []
            }

            route.providers.forEach((provider:Provider) => {
                seperatedRoute.providers = []
                seperatedRoute.providers.push(provider)
                seperatedData.legs.push(seperatedRoute)
            })
        })
    }

    function companySort(company_a: Company, company_b: Company) {
        if (company_a.name > company_b.name) {
            return 1
        }

        if (company_a.name < company_b.name) {
            return -1
        }

        return 0
    }

    function planetSort(planet_a: Planet, planet_b: Planet) {
        if (planet_a.name > planet_b.name) {
            return 1
        }

        if (planet_a.name < planet_b.name) {
            return -1
        }

        return 0
    }

    function findAllAvailablePlanets() {
        seperatedData.legs.forEach((route: Route) => {
            let cur_from_planet = route.routeInfo.from.name
            let cur_to_planet = route.routeInfo.to.name

            if (!allStartingPlanets.some(planet => planet.name == cur_from_planet)) {
                allStartingPlanets.push(route.routeInfo.from)
            }

            if (!allEndingPlanets.some(planet => planet.name == cur_to_planet)) {
                allEndingPlanets.push(route.routeInfo.to)
            }
        });

        allStartingPlanets.sort(planetSort)
        allEndingPlanets.sort(planetSort)
    }

    function findAllAvailableCompanies() {
        seperatedData.legs.forEach((route: Route) => {
            route.providers.forEach((provider: Provider) => {
                if (!allCompanies.some(company => company.name == provider.company.name)) {
                    allCompanies.push(provider.company)
                }
            })
        })

        allCompanies.sort(companySort)
    }

    function removeExcludedCompanies(route: Route) {
        console.log(route.providers)
        route.providers = route.providers.filter((provider: Provider) => {
            return !excludeCompanies.some(companyName => companyName == provider.company.name)
        })
        console.log(route.providers)

        return route
    }

    function validatePath(possiblePath: Route[]) {
        console.log(possiblePath)

        if (possiblePath.length != 0) {
            if (possiblePath[0].routeInfo.from.name != startPlanet) return false; // Check if starting planet is the correct one
            if (possiblePath[possiblePath.length - 1].routeInfo.to.name != endPlanet) return false; // Check if the ending planet is the correct one
            let revisited_check = false
            let no_companies = false

            possiblePath.forEach(route => {
                if (possiblePath.some(check_route => {
                    if (check_route.routeInfo.id == route.routeInfo.id) return false;

                    console.log(check_route.routeInfo.from.name , " | " , route.routeInfo.from.name, check_route.routeInfo.from.name == route.routeInfo.from.name)
                    return check_route.routeInfo.from.name == route.routeInfo.from.name
                })) {
                    console.log("Revisited")
                    revisited_check = true
                }

                if (route.providers.length == 0) {
                    no_companies = true
                }
            });

            if (revisited_check) return false
            if (no_companies) return false


            // Add over all price check

            // Add Planet exclusion check

            // Add Company exclusion check
            return true
        } else {
            return false
        }
    }

    function getRoutesWithStartOf(start: String, excludedRoutes: Route[]) {
        let res: Route[] = []

        seperatedData.legs.forEach(route => {
            if (!excludedRoutes.some(check_route => check_route.routeInfo.id == route.routeInfo.id)) {
                if (route.routeInfo.from.name == start) {
                    res.push(route)
                }
            }
        })

        return res
    }

    function calculateAllPossiblePaths(cur_parent_route?: Route, possiblePath?: Route[]) {
        let all_start_routes = []

        if (possiblePath === undefined) {
            possiblePath = []
        }

        console.log(possiblePath)

        if (validatePath(possiblePath)) {
            calcPaths.push(possiblePath)
            return
        };

        if (cur_parent_route === undefined) {
            console.log("Start")
            all_start_routes = getRoutesWithStartOf(startPlanet, possiblePath)
        } else {
            all_start_routes = getRoutesWithStartOf(cur_parent_route.routeInfo.to.name, possiblePath)
        }

        console.log(all_start_routes)
        
        if (all_start_routes.length != 0) {
            all_start_routes.forEach(route => {
                route = removeExcludedCompanies({ ...route })
                let newPath = [...<[]>possiblePath, route]
                console.log(newPath)

                calculateAllPossiblePaths(route, newPath)
            });
        }
    }

    function startCalculatePossiblePaths() {
        calcPaths = []
        if (allStartingPlanets.some(planet => planet.name == startPlanet) && allEndingPlanets.some(planet => planet.name == endPlanet)) {
            console.log("start")
            calculateAllPossiblePaths()
        }   

        calcPaths.sort()

        console.log(calcPaths)
        console.log(excludeCompanies)
    }


    $:[startPlanet, endPlanet, excludeCompanies], startCalculatePossiblePaths();
    seperateAllCompaniesIntoSeperatePaths()
    findAllAvailablePlanets()
    findAllAvailableCompanies()
    console.log(seperatedData)
</script>

<div class="bg-secondary rounded rounded-3 p-2  text-light">
    <div class="d-flex">
        <div class="w-100">
            <select class="form-select" bind:value={startPlanet}>
                {#each allStartingPlanets as planet }
                    <option value="{planet.name}">{planet.name}</option>
                {/each}
            </select>
        </div>
        <div class="w-25 text-center">
            <h3>
                ->
            </h3>
        </div>

        <div class="w-100">
            <select class="form-select" bind:value={endPlanet}>
                {#each allEndingPlanets as planet }
                    <option value="{planet.name}">{planet.name}</option>
                {/each}
            </select>
        </div>
    </div>

    <div class="mt-3">
        <select class="form-select" bind:value={excludeCompanies} multiple size="5">
            {#each allCompanies as company}
                <option value="{company.name}">{company.name}</option>
            {/each}
        </select>
    </div>

</div>

<RouteDisplay
    calcPaths = {calcPaths}
>

</RouteDisplay>
