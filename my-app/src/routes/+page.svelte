<script>
    import MainPage from "$lib/components/mainPage.svelte";
    import user from "../user";
    import Login from "$lib/components/login/login.svelte";

    export let data


    $: isLoggedIn = !$user === null ? false : true;

    function logout() {
        //user.update(val = > val = null)
    }


</script>

<button type="button" class="btn" value="Logout" on:click={logout}> Log out </button>

{#if isLoggedIn}

<div class="container mt-5 bg-light rounded rounded-3 p-3">

    
    <MainPage
        data = {data}
    ></MainPage>

    {#each data.legs as routes}
        <div>
            {routes.routeInfo.from.name} -> {routes.routeInfo.to.name} | {routes.routeInfo.distance}
            <br/>
            <div style="margin-left: 2rem;">
                Company's providing route
            </div>


        </div>
        <br/>
    {/each}
</div>

{:else}

    <h2>Please login to continue</h2>
    <Login></Login>
{/if}


