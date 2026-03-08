export default async function handler(req, res) {

try {

const { imei, service } = req.body

const API_KEY = "zPxFG-eANVU-OpN1q-NpwpJ-XptdG-m2DYL

const url = `https://alpha.imeicheck.com/api/php-api/create?key=${API_KEY}&service=${service}&imei=${imei}`

const response = await fetch(url)

const data = await response.json()

res.status(200).json(data)

} catch (error) {

res.status(500).json({
error: "API request failed",
details: error.message
})

}

}