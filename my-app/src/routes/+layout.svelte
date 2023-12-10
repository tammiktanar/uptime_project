<script>
    import { goto } from "$app/navigation";
    import { env } from "$env/dynamic/public";
    import LoginRedirectButton from "$lib/components/loginRedirectButton.svelte";
    import user from "../user";

    $: isLoggedIn = $user === null? false : true;

    async function logout() {
        await fetch(env.PUBLIC_API_HTTP + '://'+env.PUBLIC_API_IP+':'+env.PUBLIC_API_PORT+'/api/logout', {
            method: "POST",
                credentials: 'include',
                headers: {
                    'Accept': 'application/json',
                    'Content-type': 'application/json',
                }
        })

        user.update(val => val = null)
        await goto('/', {noScroll: false, replaceState: true})
    }
</script>


<nav class="navbar navbar-expand bg-body-tertiary">
    <div class="container-fluid">
        <a class="navbar-brand" href="/">Cosmos Odyssey</a>

        <div class="collapse navbar-collapse" id="navbarNav">
            <ul class="navbar-nav">
                <li class="nav-item">
                    <a class="nav-link active" href="/">Home</a>
                </li>

                <li class="nav-item">
                    <a class="nav-link" href="/reservations">Reservations</a>
                </li>
            </ul>
        </div>
        {#if isLoggedIn}
            <button class="btn btn-outline-danger"  on:click={logout} type="submit">Log out</button>
        {:else}
            <LoginRedirectButton></LoginRedirectButton>
        {/if}
    </div>
</nav>


<div class="">
    <slot></slot>
</div>