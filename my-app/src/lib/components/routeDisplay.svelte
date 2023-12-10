<script lang="ts">
    import type { Route } from "../../common/store";
    import PathDisplay from "./pathDisplay.svelte";
    import PlanetIcon from "./planetIcon.svelte";

    export let seperatedPaths: Route[][]
    export let loadingData: boolean
    export let reservationsCreatable = true
    let showing = 15



</script>
 


<div class="">
    {#if loadingData}
        <span class="text-light">Please wait, loading data</span>
    {:else}
        {#if seperatedPaths.length == 0}
            <div class="text-light">
                <h4>No route was found</h4>

            </div>
        {:else}
            {#each seperatedPaths.slice(0, showing) as path}
                <PathDisplay
                    path= {path}
                    reservationsCreatable= {reservationsCreatable}
                ></PathDisplay>
            {/each}

            {#if seperatedPaths.length > showing}
                <div class="d-flex justify-content-center mt-3">
                    <button class="btn btn-primary" on:click={() => {showing += 15}}>Show more...</button>
                </div>


            {/if}
        {/if}
    {/if}
</div>
