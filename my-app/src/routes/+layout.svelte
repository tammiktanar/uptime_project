<script>
    import { goto } from "$app/navigation";
    import user from "../user";

    $: isLoggedIn = $user === null? false : true;

    async function logout() {
        await fetch('http://localhost:5175/api/logout', {
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


<nav class="navbar bg-body-tertiary">
    <div class="container-fluid">
        <a class="navbar-brand">Uptime project</a>

        {#if isLoggedIn}
            <button class="btn btn-outline-danger"  on:click={logout} type="submit">Log out</button>
        {:else}
            <button class="btn btn-outline-success"  on:click={async() => {await goto('/login')}} type="submit"> Login </button>
        {/if}
    </div>
</nav>


<div class="">
    <slot></slot>
</div>