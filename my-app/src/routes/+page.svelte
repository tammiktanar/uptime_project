<script>
    import { onMount } from "svelte";
    import { env } from "$env/dynamic/public";
    import MainPage from "$lib/components/mainPage.svelte";
    import user from "../user";
    import LoginRedirectButton from "$lib/components/loginRedirectButton.svelte";

    export let data


    $: isLoggedIn = $user === null ? false : true;

    onMount(async function() {
        const userLoggedInStatus = async function() {
            const res = await fetch(env.PUBLIC_API_HTTP + '://'+env.PUBLIC_API_IP+':'+env.PUBLIC_API_PORT+'/api/user', {
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



<div class="container mt-5 bg-light rounded rounded-3 p-3 mb-5">

    
    <MainPage
        data = {data}
    ></MainPage>

</div>


<div class="mt-5 mb-5"></div>

