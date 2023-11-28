import { get_all_data } from "$lib/server/planets";


export async function load({ params, cookies }) {
    return await get_all_data();
}
