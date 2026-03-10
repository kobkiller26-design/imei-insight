export default async function handler(req,res){

try{

const apiKey = process.env.IMEI24_API_KEY
const apiUrl = process.env.IMEI24_API_URL || "https://api-client.imei.org/api/dhru"

if (!apiKey || apiKey.includes("your_imei24_api_key")) {
return res.status(500).json({ error: "IMEI24_API_KEY is not configured" })
}

const params = new URLSearchParams({
apiaccesskey: apiKey,
request: "SERVICE_LIST"
})

const response=await fetch(`${apiUrl}?${params}`)

const data=await response.json()

res.status(200).json({ services: data })

}catch(err){

res.status(500).json({
error:"Service fetch failed"
})

}

}