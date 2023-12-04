<script>
    import { goto } from "$app/navigation";


</script>









<button class="btn btn-outline-success"  on:click={async() => {await goto('/login')}} type="submit"> Login </button>