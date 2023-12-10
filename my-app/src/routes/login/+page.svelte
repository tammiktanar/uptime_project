<script>
    import { goto } from "$app/navigation";
    import { env } from "$env/dynamic/public";
    import user from "../../user";


    let email = ''
    let password = ""
    let currentError = ""

    function login() {
        fetch(env.PUBLIC_API_HTTP + '://'+env.PUBLIC_API_IP+':'+env.PUBLIC_API_PORT+'/api/login', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },

            body: JSON.stringify({
                email: email,
                password: password
            })

        }).then((res) => {
            return res.json();
        }).then((data) => {
            if (data.error === true) throw new Error(data.message)
        }).then(async() =>{
            await goto('/', {noScroll: false, replaceState: true})
        }).catch((error) => {
            currentError = error
            console.error("Error logging in:", error)
        })
    }
</script>


<div class="container p-3 d-flex justify-content-center align-items-center" style="height: 60rem;">

        {#if currentError}
            <div class="alert alert-danger">
                {currentError}
            </div>
        {/if}


    <form on:submit|preventDefault={login}>
        <div class="container bg-light border border-3 rounded-3 px-3 py-3" style="min-width: 50rem;">
            <div class="form-floating">
                <input class="form-control" bind:value={email} id="email" type="email" placeholder="name@example.com"/>
                <label for="email">Email address</label>
            </div>

            <div class="form-floating">
                <input class="form-control mt-3" bind:value={password} id="password" type="password" placeholder="password"/>
                <label for="password">Password</label>
            </div>  

            <button class="form-control btn btn-success mt-3" type="submit"> Log in </button>
            <button class="form-control btn btn-primary mt-3" type="button" on:click={async() => {await goto('/register')}}> Or Register </button>
            
        </div>
    </form>

</div>
