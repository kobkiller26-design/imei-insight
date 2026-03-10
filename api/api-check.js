export default async function handler(req, res) {

try {

const imei = req.method === 'POST' ? req.body?.imei : req.query.imei
const service = req.method === 'POST' ? req.body?.service : req.query.service

if (!imei) {
res.status(400).json({error:"IMEI required"})
return
}

if (!/^\d{15}$/.test(String(imei))) {
res.status(400).json({error:"IMEI must be exactly 15 digits"})
return
}

const API_KEY = process.env.IMEI_API_KEY || process.env.IMEI24_API_KEY || ""

if (!API_KEY) {
res.status(500).json({error:"API key not configured"})
return
}

const SERVICE_ID = service || "1"

const url =
`https://alpha.imeicheck.com/api/php-api/create?key=${API_KEY}&service=${SERVICE_ID}&imei=${imei}`

const response = await fetch(url)

const data = await response.json()

res.status(200).json(data)

} catch (error) {

res.status(500).json({
error:"Server error",
details:error.toString()
})

}

}