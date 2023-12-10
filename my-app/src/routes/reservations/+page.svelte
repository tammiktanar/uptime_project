<script>
    import PathDisplay from "$lib/components/pathDisplay.svelte";
    export let data

</script>


<div class="container mt-5 bg-light rounded rounded-3 p-3 mb-5">
    <div class="mt-2 bg-dark rounded rounded-3 p-2 s-Vys19DcT1UFV">
        {#if data.reservations === undefined || data.reservations.length == 0}
            <span class="text-light">
                No reservations have been made
            </span>
        {:else}
            {#each data.reservations as reservation}
                <PathDisplay
                    path= {JSON.parse(reservation.route)}
                    reservation= {reservation}
                    reservationsCreatable = {false}
                >

                </PathDisplay>
            {/each}
        {/if}
    </div>
</div>