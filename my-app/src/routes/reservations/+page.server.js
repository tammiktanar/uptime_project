import { get_all_reservations } from "$lib/server/planets";


export async function load({ params, cookies }) {
    const data = await get_all_reservations();
    return data
}
