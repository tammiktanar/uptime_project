<script lang="ts">
    import { checkDistance, getRoutesWithStartOf, removeUnwantedCompanies, validatePath, validateSortedPath } from "../../common/pathCalcFunctions";
    import { sortByDistance, sortByPrice, sortByTime } from "../../common/seperatedPathSorting";
    import type { Company, Data, Planet, Provider, Route } from "../../common/store";
    import RouteDisplay from "./routeDisplay.svelte";
    
    
    export let data: Data

    let startPlanet = ""
    let endPlanet = ""
    let requestedDistance = 0
    let requestedPrice = 0
    let loadingData = false

    let sortingType = 'priceRev'

    let allStartingPlanets: Planet[] = []

    let allEndingPlanets: Planet[] = []

    let allCompanies: Company[] = []

    let excludeCompanies: string[] = []
 
    let calcPaths: Route[][] = []
    let seperatedPaths: Route[][] = []

    let timer: number;

    let todaysDate = new Date()

    let departAtDate = (
            todaysDate.getFullYear() + "-" + 
            (todaysDate.getMonth()+1).toString().padStart(2, "0") + "-" +
            todaysDate.getDate().toString().padStart(2, "0") + "T" + 
            todaysDate.getHours().toString().padStart(2, "0") + ":" + 
            todaysDate.getMinutes().toString().padStart(2, "0") 
        )

    let arriveByDate = (
            (todaysDate.getFullYear()+1) + "-" + 
            (todaysDate.getMonth()+1).toString().padStart(2, "0") + "-" +
            todaysDate.getDate().toString().padStart(2, "0") + "T" + 
            todaysDate.getHours().toString().padStart(2, "0") + ":" + 
            todaysDate.getMinutes().toString().padStart(2, "0") 
        )



    let longestDistance = 0
    let highestPrice = 0

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
        data.pricelist.forEach((route: Route) => {
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
        data.pricelist.forEach((route: Route) => {
            route.providers.forEach((provider: Provider) => {
                if (!allCompanies.some(company => company.name == provider.company.name)) {
                    allCompanies.push(provider.company)
                }
            })
        })

        allCompanies.sort(companySort)
    }



    function findHighestPriceAndDistance() { // Gets the highest possible price, and finds the longest possible distance
        data.pricelist.forEach((route: Route) => {
            if ((route.routeInfo.distance * allEndingPlanets.length) > longestDistance) {
                longestDistance = route.routeInfo.distance * allEndingPlanets.length // Highest found distance * the amount of planets would mean no other route is longer
            }

            route.providers.forEach((provider: Provider) => {
                if ((provider.price * allEndingPlanets.length) > highestPrice) {
                    highestPrice = provider.price * allEndingPlanets.length // Highest found price * the amount of planets would mean no other route is more expensive
                }
            })
        })

        requestedDistance = longestDistance
        requestedPrice = highestPrice
    }






    function calculateAllPossiblePaths(cur_parent_route?: Route, possiblePath?: Route[]) { // Finds all possible paths between planets
        let all_start_routes = []

        if (possiblePath === undefined) {
            possiblePath = []
        }

        if (!checkDistance(possiblePath, requestedDistance)) {
            return 
        } else if (validatePath(possiblePath, startPlanet, endPlanet)) { // Check that the path is actually valid
            calcPaths.push(possiblePath)
            return
        } else if (possiblePath.length >= allEndingPlanets.length) { // If path is impossibly long remove it
            return 
        };

        if (cur_parent_route === undefined) {
            all_start_routes = getRoutesWithStartOf(data, startPlanet, possiblePath) // Get routes that start with the name of the requested planet
        } else {
            all_start_routes = getRoutesWithStartOf(data, cur_parent_route.routeInfo.to.name, possiblePath) // Get routes that start with the name of the last planets landing planet
        }
        
        if (all_start_routes.length != 0) {
            all_start_routes.forEach(async (route) => {                
                // Removes companies that are in the exception list and have too high prices, long distances, or dates that do not match
                route = removeUnwantedCompanies({ ...route }, excludeCompanies, departAtDate, arriveByDate) 
                
                let newPath = [...<[]>possiblePath, route]

                calculateAllPossiblePaths(route, newPath)
            });
        }
    }



    // Seperate all found paths from their companies, and sort it to find all possibilities
    function seperatePaths(cur_parent_route?: Route, possiblePath?: Route[], routeIndex?:number, curPlanetIndex?: number) {
        if (possiblePath === undefined) {
            possiblePath = []
        }

        if (cur_parent_route === undefined) {
            calcPaths.forEach((path: Route[], curRouteIndex) => {
                let seperatedRoute: Route = {
                    id: path[0].id,
                    routeInfo: path[0].routeInfo,
                    validUntil: path[0].validUntil,
                    providers: []
                }

                let curPlanetArrivalTime = new Date(departAtDate)
                let requestedArrivalTime = new Date(arriveByDate)

                path[0].providers.forEach((provider: Provider) => {
                    let curRoute = {...seperatedRoute} 
                    curRoute.providers = [provider]

                    let newPlanetDepartTime = new Date(provider.flightStart)
                    let newPlanetArrivalTime = new Date(provider.flightEnd)

                    if (curPlanetArrivalTime > newPlanetDepartTime) return;
                    if (requestedArrivalTime < newPlanetArrivalTime) return; 

                    let newPath = [curRoute]
                    seperatePaths(curRoute, newPath, curRouteIndex, 1)
                })
            })
        } else {
            if (calcPaths[calcPaths.length - 1].length < possiblePath.length) { // Cannot be longer than previously found planet paths
                return 
            }

            if (possiblePath.length >= allEndingPlanets.length) { // Cannot travel more than planets exist
                return 
            }

            if (seperatedPaths.length == 20000) { // Hard cap of how many paths to generate, otherwise might take too long
                return
            }

            if (validatePath(possiblePath, startPlanet, endPlanet)) {
                seperatedPaths= [...seperatedPaths, possiblePath]
                return
            }


            if (routeIndex !== undefined && curPlanetIndex !== undefined && curPlanetIndex != 0) {
                if (calcPaths.length > routeIndex) {
                    if (calcPaths[routeIndex].length > curPlanetIndex) {
                        let seperatedRoute: Route = {
                            id: calcPaths[routeIndex][curPlanetIndex].id,
                            routeInfo: calcPaths[routeIndex][curPlanetIndex].routeInfo,
                            validUntil: calcPaths[routeIndex][curPlanetIndex].validUntil,
                            providers: []
                        }
                        
                        let curPlanetArrivalTime = new Date(departAtDate)
                        let requestedArrivalTime = new Date(arriveByDate)
                        
                        calcPaths[routeIndex][curPlanetIndex].providers.forEach((provider: Provider) => {
                            let curRoute = {...seperatedRoute} 
                            curRoute.providers = [provider]

                            let newPlanetDepartTime = new Date(provider.flightStart)
                            let newPlanetArrivalTime = new Date(provider.flightEnd)

                            if (curPlanetArrivalTime > newPlanetDepartTime) return;
                            if (requestedArrivalTime < newPlanetArrivalTime) return;

                            let newPath = [...<[]>possiblePath, curRoute]

                            if (validateSortedPath(newPath, departAtDate, arriveByDate, requestedPrice, requestedDistance)) return;

                            seperatePaths(curRoute, newPath, routeIndex, curPlanetIndex+1)
                        })
                    } else {
                        return
                    }
                } else {
                    return
                }
            }
        }
    }

    async function startCalculatePossiblePaths() {
        calcPaths = []
        seperatedPaths = []

        if (allStartingPlanets.some(planet => planet.name == startPlanet) && allEndingPlanets.some(planet => planet.name == endPlanet)) {
            console.log("start")
            calculateAllPossiblePaths()


            
            calcPaths.sort()

            console.log("Seperating paths")

            seperatePaths()

            sortSeperatedPaths()

            console.log("Paths calculated:", calcPaths)
            console.log("Finished seperating:", seperatedPaths)
        }   



        loadingData = false
    }

    function loadNewData() {
        loadingData = true

        setTimeout(function () {
            startCalculatePossiblePaths()
        }, 1000)
        
    }

    const debouce = (givenFunction: Function, timeout = 3000) => {
        return (...args: any) => {
            clearTimeout(timer);

            timer = setTimeout(() => { 
                givenFunction.apply(args); 
            }, timeout);
        }
    }

    function attemptNewDataGeneration() {
        const debouncedFunc = debouce(loadNewData)

        debouncedFunc()
    }

    async function sortSeperatedPaths() {
        console.log("Sorting", sortingType)
        console.log(seperatedPaths)
        switch (sortingType) {
            case 'distance':
                seperatedPaths.sort(sortByDistance)
                break;
            case 'distanceRev':
                seperatedPaths.sort(sortByDistance)
                seperatedPaths.reverse()
                break;
            case 'price':
                seperatedPaths.sort(sortByPrice)
                break;
            case 'priceRev':
                seperatedPaths.sort(sortByPrice)
                seperatedPaths.reverse()
                break;
            case 'time':
                seperatedPaths.sort(sortByTime)
                break;
            case 'timeRev':
                seperatedPaths.sort(sortByTime)
                seperatedPaths.reverse()
                break;
            default:
                break;
        }

        console.log('Done sorting')
        console.log(seperatedPaths)
    }

    // If any of the variable's change, recalculate paths
    $:[startPlanet, 
        endPlanet, 
        excludeCompanies, 
        requestedDistance, 
        requestedPrice, 
        arriveByDate, 
        departAtDate
    ], attemptNewDataGeneration();

    $:[sortingType], sortSeperatedPaths()

    findAllAvailablePlanets()
    findAllAvailableCompanies()
    findHighestPriceAndDistance()
</script>

<div class="bg-dark rounded rounded-3 p-2  text-light">
    <div class="d-flex bg-light p-3 rounded">
        <div class="w-100">
            <div class="form-floating ">
                <select class="form-select border-dark border-2" id="startPlanet" bind:value={startPlanet}>
                    {#each allStartingPlanets as planet }
                        <option value="{planet.name}">{planet.name}</option>
                    {/each}
                </select>

                <label for="startPlanet">Departure planet:</label>
            </div>
        </div>

        <div class="w-25 text-center text-dark mt-2">
            <h3>
                ->
            </h3>
        </div>

        <div class="w-100">

            <div class="form-floating ">
                <select class="form-select border-dark border-2" id="endPlanet" bind:value={endPlanet}>
                    {#each allEndingPlanets as planet }
                        <option value="{planet.name}">{planet.name}</option>
                    {/each}
                </select>

                <label for="endPlanet">Arrival planet:</label>
            </div>

        </div>
    </div>

    <div class="bg-light p-3 rounded mt-3">
        <div class="form-floating ">
            <input class="form-control border-dark border-2" id="departAtDate" type="datetime-local" bind:value={departAtDate}>
            <label for="departAtDate">Depart at date:</label>

        </div>

        <div class="form-floating mt-3">
            <input class="form-control border-dark border-2" id="arriveByDate" type="datetime-local" bind:value={arriveByDate}>
            <label for="arriveByDate">Arrive by date:</label>
        </div>
    </div>

    <div class="bg-light p-3 rounded rounded-2 mt-3">
        <div class="form-floating bg-white rounded rounded-3 p-3">
            <input class="form-control w-25 border-dark border-2" id="requestedDistance" type="number" min='0' max={longestDistance} bind:value={requestedDistance}/>
            <input class="form-range border border-dark rounded rounded-5 mt-3 bg-light" type="range" min='0' max={longestDistance} bind:value={requestedDistance}/>

            <label for="requestedDistance">Max travel distance:</label>
        </div>


        <div class="form-floating bg-white rounded rounded-3 mt-4 p-3">
            <input class="form-control w-25 border-dark border-2" id="requestedPrice" type="number" min='0' max={highestPrice} bind:value={requestedPrice}/>
            <input class="form-range border border-dark rounded rounded-5 mt-3 bg-light" type="range" min='0' max={highestPrice} bind:value={requestedPrice}/>

            <label for="requestedPrice">Max price:</label>
        </div>

    </div>


    <div class="bg-light p-3 rounded mt-3">
        <select class="form-select border-dark border-2" bind:value={excludeCompanies} multiple size="5">
            {#each allCompanies as company}
                <option value="{company.name}">{company.name}</option>
            {/each}
        </select>
    </div>


    <div class="mt-2">
        <span class="text-secondary ">Hard limit at 20,000 paths</span>
    </div>
</div>

<div class="mt-2 bg-dark rounded rounded-3 p-2 d-flex">
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <button class="btn btn-primary form-control mx-2"
        on:click={() => {
            if (sortingType == "price") {
                sortingType = "priceRev"
            } else if (sortingType == "priceRev"){
                sortingType = "price"
            } else {
                sortingType = "price"
            }

            console.log(sortingType)
        }}
    >
        Sort by price
    <i class="fa-solid fa-sort ms-2" 
        class:fa-sort={(sortingType!="price" && sortingType!="priceRev")}
        class:fa-sort-down={(sortingType=="price")}
        class:fa-sort-up={(sortingType=="priceRev")}></i>
    </button>

    <button class="btn btn-primary form-control mx-2"
        on:click={() => {
            if (sortingType == "distance") {
                sortingType = "distanceRev"
            } else if (sortingType == "distanceRev"){
                sortingType = "distance"
            } else {
                sortingType = "distance"
            }

            console.log(sortingType)
        }}
    >
        Sort by distance
    <i class="fa-solid fa-sort ms-2 " 
        class:fa-sort={(sortingType!="distance" && sortingType!="distanceRev")}
        class:fa-sort-down={(sortingType=="distance")}
        class:fa-sort-up={(sortingType=="distanceRev")}></i>
    </button>

    <button class="btn btn-primary form-control mx-2"
        on:click={() => {
            if (sortingType == "time") {
                sortingType = "timeRev"
            } else if (sortingType == "timeRev"){
                sortingType = "time"
            } else {
                sortingType = "time"
            }

            console.log(sortingType)
        }}
    >
        Sort by travel time
    <i class="fa-solid fa-sort ms-2" 
        class:fa-sort={(sortingType!="time" && sortingType!="timeRev")}
        class:fa-sort-down={(sortingType=="time")}
        class:fa-sort-up={(sortingType=="timeRev")}></i>
    </button>

</div>

<div class="mt-2 bg-dark rounded rounded-3 p-2">
    {#key sortingType}
        <RouteDisplay
            loadingData = {loadingData}
            seperatedPaths = {seperatedPaths}
        >

        </RouteDisplay>
    {/key}
</div>

<style>
    
</style>

