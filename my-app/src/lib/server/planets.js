


export async function get_all_data() {
    const res = await fetch("https://cosmos-odyssey.azurewebsites.net/api/v1.0/TravelPrices") 
    const data = await res.json();

    return data
}