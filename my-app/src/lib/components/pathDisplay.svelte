<script lang="ts">
    import { env } from "$env/dynamic/public";
    import type { Reservation, Route } from "../../common/store";
    import PathRouteTooltip from "./pathRouteTooltip.svelte";
    import PlanetDisplay from "./planetDisplay.svelte";
    import PlanetIcon from "./planetIcon.svelte";    
    
    
    export let path: Route[]
    export let reservationsCreatable = true
    export let reservation: Reservation = {
        firstName: '',
        lastName: '',
        id: 0,
        userID: 0,
        route: [],
        validDate: ''
    }
    
    let firstName = ''
    let lastName = ''

    let totalDistance = 0
    let totalPrice = 0

    let success = false
    let reservationCreation = false

    path.forEach(route => {
        totalDistance += route.routeInfo.distance
        totalPrice += route.providers[0].price
    })

    function createReservation() {
        if (!reservationsCreatable) return
        if (!reservationCreation) return
        if (success) return
        fetch(env.PUBLIC_API_HTTP + '://'+env.PUBLIC_API_IP+':'+env.PUBLIC_API_PORT+'/api/reservationsCreate', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },

            body: JSON.stringify({
                firstName: firstName,
                lastName: lastName,
                route: path,
            })

        }).then((res) => {
            return res.json();
        }).then((data) => {
            if (data.error === true) {
                alert(data.message)
                throw new Error(data.message)
            }
            success = true
        })
    }


    
    let departingDateTimeString = ""
    let arivingDateTimeString = ""

    let departingDateTime = new Date(path[0].providers[0].flightStart)
    let arivingDateTime = new Date(path[path.length-1].providers[0].flightEnd)

    departingDateTimeString = (
            departingDateTime.getFullYear() + "/" + 
            (departingDateTime.getMonth()+1).toString().padStart(2, "0") + "/" +
            departingDateTime.getDate().toString().padStart(2, "0") + " " + 
            departingDateTime.getHours().toString().padStart(2, "0") + ":" + 
            departingDateTime.getMinutes().toString().padStart(2, "0") 
        )
    arivingDateTimeString = (
            arivingDateTime.getFullYear() + "/" + 
            (arivingDateTime.getMonth()+1).toString().padStart(2, "0") + "/" +
            arivingDateTime.getDate().toString().padStart(2, "0") + " " + 
            arivingDateTime.getHours().toString().padStart(2, "0") + ":" + 
            arivingDateTime.getMinutes().toString().padStart(2, "0") 
        )

    let timeTraveled = new Date((arivingDateTime - departingDateTime))

    var seconds = Math.floor(timeTraveled / 1000),
    minutes = Math.floor(seconds / 60),
    hours   = Math.floor(minutes / 60),
    days    = Math.floor(hours / 24),
    months  = Math.floor(days / 30),
    years   = Math.floor(days / 365);

    seconds %= 60;
    minutes %= 60;
    hours %= 24;
    days %= 30;
    months %= 12;

    let timeTraveledString = (
        (months + " Months ") +
        (days + " Days ") +
        (hours + " Hours ") +
        (minutes + " Minutes ") 
    )
</script>



<div class="text-light p-3 border border-3 rounded mt-2">
    <div class="d-flex">
        <div class="col-md-10 d-flex">
            <div class="d-flex">
                {#each path as route, key}
                        {#if key == 0} 

                            <PlanetDisplay
                                planetName={route.routeInfo.from.name}
                            >
                            </PlanetDisplay>
                        {/if}
                        <PathRouteTooltip
                            route={route}
                        >       
                            <div class="mx-3  pt-3">
                        
                                    <i class="fa-solid fa-arrow-right"></i>


                            </div>
                        </PathRouteTooltip>

                        <PlanetDisplay
                            planetName={route.routeInfo.to.name}
                        >
                        </PlanetDisplay>
                {/each}
            </div>

            <div class="px-5 ms-auto">
                <span>Total distance: <p class="fw-bold">{totalDistance}</p></span>
                <span>Total price: <p class="fw-bold">{totalPrice}$</p></span>
                <span>Departure date: <p class="fw-bold">{departingDateTimeString}</p></span>
                <span>Arrival date: <p class="fw-bold">{arivingDateTimeString}</p></span>
                <span>Time spent traveling: <p class="fw-bold">{timeTraveledString}</p></span>
            </div>
        </div>
        
        <div class="col-md-2">
            {#if !reservationCreation && reservationsCreatable}

                <div>
                    <button class="btn btn-success" on:click={() => {reservationCreation = true}}>Make reservation</button>
                </div>
            {:else if !reservationsCreatable}
                <span >Created by: <p class="fw-bold">{reservation.firstName} {reservation.lastName}</p></span>
                <span >Valid till: <p class="fw-bold">{new Date(reservation.validDate)}</p></span>
            {/if}
        </div>
    </div>

    {#if reservationCreation && reservationsCreatable}
        <div class="mt-2 border rounded border-light">
            <div class="d-flex p-3">
                <div class="form-floating col-md-5">
                    <input class="form-control" bind:value={firstName} disabled={success} id="firstName" type="text" placeholder="First name"/>
                    <label class="text-secondary" for="firstName">First name</label>
                </div>

                <div class="col-md-2">

                </div>

                <div class="form-floating col-md-5">
                    <input class="form-control" bind:value={lastName} disabled={success} id="lastName" type="text" placeholder="Last name"/>
                    <label class="text-secondary" for="lastName">Last name</label>
                </div>
            </div>

            <div class="d-flex justify-content-center mb-3">
                {#if success}
                    <div>
                        <span>Reservation was created</span>
                    </div>
                {:else}
                    <div>
                        <button class="btn btn-primary me-3" on:click={createReservation}>Create reservation</button>
                    </div>

                    <div>
                        <button class="btn btn-danger" on:click={() => {reservationCreation = false}}>Cancel making reservation</button>
                    </div>
                {/if}
            </div>

        </div>
    {/if}
</div>