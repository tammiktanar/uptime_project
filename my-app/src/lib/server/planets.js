import { env } from "$env/dynamic/public";



export async function get_all_data() {
    const res = await fetch(env.PUBLIC_API_HTTP + '://'+env.PUBLIC_API_IP+':'+env.PUBLIC_API_PORT+'/api/pricelist', {
        method: "GET",
        headers: {
            'Accept': 'application/json',
            'Content-type': 'application/json',
        }
    })

    const data = await res.json();

    return data.data
}

export async function get_all_reservations() {
    const res = await fetch(env.PUBLIC_API_HTTP + '://'+env.PUBLIC_API_IP+':'+env.PUBLIC_API_PORT+'/api/reservations', {
        method: "GET",
        headers: {
            'Accept': 'application/json',
            'Content-type': 'application/json',
        }
    })

    const data = await res.json();

    return data.data
}