<script>
    import { onMount } from "svelte";
    import MainPage from "$lib/components/mainPage.svelte";
    import user from "../user";
    import LoginRedirectButton from "$lib/components/loginRedirectButton.svelte";

    export let data


    $: isLoggedIn = $user === null ? false : true;

    onMount(async function() {
        const userLoggedInStatus = async function() {
            const res = await fetch('http://localhost:5175/api/user', {
                method: "GET",
                credentials: 'include',
                headers: {
                    'Accept': 'application/json',
                    'Content-type': 'application/json',
                }
            })
            return res
        }

        const result = await userLoggedInStatus()
        const returnedData = await result.json()
        if (returnedData.success === true) {
            user.update(val => val = returnedData.data)
        }
    })


</script>


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

    <div class="mt-5 text-center">
        <h3>
            Please log in to use this page
        </h3>
        <LoginRedirectButton></LoginRedirectButton>
    </div>

{/if}


