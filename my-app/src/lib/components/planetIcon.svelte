<script lang="ts">
    export let planet =""

    let planet_icon = ""
    
    planet = planet.toLowerCase()

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



