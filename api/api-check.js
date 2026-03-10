import { validateIMEI } from "../lib/imei.js"

export default async function handler(req, res) {

try {

const imei = req.method === "POST"
  ? (req.body && req.body.imei)
  : req.query.imei

if (!imei) {
res.status(400).json({error:"IMEI required"})
return
}

const validation = validateIMEI(imei)
if (!validation.valid) {
return res.status(400).json({ error: validation.error })
}

const API_KEY = process.env.IMEI24_API_KEY
const API_URL = process.env.IMEI24_API_URL || "https://api-client.imei.org/api/dhru"

if (!API_KEY || API_KEY.includes("your_imei24_api_key")) {
return res.status(500).json({ error: "IMEI24_API_KEY is not configured" })
}

const params = new URLSearchParams({
apiaccesskey: API_KEY,
request: "imei",
imei: String(imei).trim()
})

const response = await fetch(`${API_URL}?${params}`)

const data = await response.json()

res.status(200).json(data)

} catch (error) {

res.status(500).json({
error:"Server error",
details:error.message
})

}

}