<script>
    import user from "../../../user";

    let username = ""
    let password = ""
    let currentError = ""

    function login() {
        fetch("http://localhost:5175/login", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: username,
                password: password
            })
        }).then((res) => {
            if (res.status < 299) return res.json();
            if (res.status > 299) currentError = "Something went wrong";
        }).then((data) => {
            if (data) user.update(val => val = {...data})
        }).catch((error) => {
            console.error("Error logging in:", error)
        })
    }

</script>


<form on:submit|preventDefault={login}>
    <div>
        <input bind:value={username} id="username" type="text"/>
        <input bind:value={password} id="password" type="password"/>
        <button type="submit"> Log in </button>
    </div>
</form>