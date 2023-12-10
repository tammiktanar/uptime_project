<script lang="ts">
    import type { Route } from "../../common/store";

	export let route:Route;
	let isHovered = false;
	let x:number;
	let y:number;
	
	function mouseOver(event:any) {
        console.log('Y')
		isHovered = true;
		x = event.pageX + 20;
		y = event.pageY + 20;
	}
	function mouseMove(event:any) {
		x = event.pageX + 20;
		y = event.pageY + 20;
	}
	function mouseLeave() {
		isHovered = false;
	}


    let departingDateTimeString = ""
    let arivingDateTimeString = ""

    let departingDateTime = new Date(route.providers[0].flightStart)
    let arivingDateTime = new Date(route.providers[0].flightEnd)

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
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-mouse-events-have-key-events -->
<div
	on:mouseover={mouseOver}
    on:mouseleave={mouseLeave}
	on:mousemove={mouseMove}
>
	<slot />
</div>

{#if isHovered}
	<div style="top: {y}px; left: {x}px;" class="path-tooltip bg-dark border border-secondary rounded rounded-2 p-3">
        <span>
            Provided by: <p class="fw-bold">{route.providers[0].company.name}</p>
            Price: <p class="fw-bold">{route.providers[0].price}$</p>
            Distance: <p class="fw-bold">{route.routeInfo.distance}</p>
            Departing: <p class="fw-bold">{departingDateTimeString}</p>
            Ariving: <p class="fw-bold">{arivingDateTimeString}</p>
        </span>
    </div>
{/if}

<style>
	.path-tooltip {
		position: absolute!important;
	}
</style>