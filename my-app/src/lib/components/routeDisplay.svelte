<script lang="ts">
    import type { Route } from "../../common/store";
    import PlanetIcon from "./planetIcon.svelte";

    export let calcPaths: Route[][]

</script>



<div class="mt-2 bg-secondary rounded rounded-3 p-2">
    {#if calcPaths.length == 0}
        <div class="text-light">
            <h4>No route was found</h4>

        </div>
    {:else}
        {#each calcPaths as path}
            <div class="text-light">
                {#each path as route, key}
                            {#if key == 0} 
                                Starting planet {route.routeInfo.from.name}
                                <PlanetIcon planet={route.routeInfo.from.name}></PlanetIcon>

                            {/if}

                            -> {route.routeInfo.to.name}
                {/each}
            </div>
        {/each}

    {/if}
</div>
