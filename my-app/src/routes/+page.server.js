import { get_all_data } from "$lib/server/planets";


export async function load({ params, cookies }) {
    const data = await get_all_data();
    return data
}
