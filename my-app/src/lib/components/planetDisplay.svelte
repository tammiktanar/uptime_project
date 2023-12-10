<script lang="ts">
    import type { Route } from "../../common/store";


    export let planetName: string

    let planet_icon = ""
    
    let planet = planetName.toLowerCase()

    switch (planet) {
        case "earth":
            planet_icon = "/planets/earth.png"
            break;
        case "jupiter":
            planet_icon = "/planets/jupiter.png"
            break;
        case "mars":
            planet_icon = "/planets/mars.png"
            break;
        case "mercury":
            planet_icon = "/planets/mercury.png"
            break;
        case "neptune":
            planet_icon = "/planets/neptune.png"
            break;
        case "saturn":
            planet_icon = "/planets/saturn.png"
            break;
        case "uranus":
            planet_icon = "/planets/uranus.png"
            break;
        case "venus":
            planet_icon = "/planets/venus.png"
            break;
        default:
            planet_icon = "/"
            break;
    }


</script>

<div class="text-align-center px-2 d-flex justify-content-center row" >
    <div class="pb-2">
        <img src={planet_icon} alt={planet} width="55">
    </div>
    <span class="border px-2 border-light rounded">{planetName}</span>
</div>
    