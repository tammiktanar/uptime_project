<script>
    import { goto } from "$app/navigation";
    import user from "../../user";


    let email = ''
    let username = ""
    let password = ""
    let currentError = ""

    function login() {
        fetch("http://localhost:5175/api/register", {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: email,
                username: username,
                password: password
            })
        }).then((res) => {
            return res.json();
        }).then((data) => {
            if (data.error === true) throw new Error(data.message)
        }).then(async() =>{
            await goto('./login', {noScroll: false, replaceState: true})
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
        <div class="container bg-light border border-3 rounded-3 px-3 py-3"  style="min-width: 50rem;">
            <input class="form-control" bind:value={email} id="email" type="email"/>
            <input class="form-control mt-3" bind:value={username} id="username" type="username"/>
            <input class="form-control mt-3" bind:value={password} id="password" type="password"/>
            <button class="form-control btn btn-primary mt-3" type="submit"> Register </button>
        </div>
    </form>

</div>
