export default async function handler(req, res) {

try {

const imei = req.query.imei

if (!imei) {
res.status(400).json({error:"IMEI required"})
return
}

/* =========================
zPxFG-eANVU-OpN1q-NpwpJ-XptdG-m2DYL
========================= */

const API_KEY = "zPxFG-eANVU-OpN1q-NpwpJ-XptdG-m2DYL"

/* =========================
DEFAULT SERVICE ID
CHANGE LATER IF NEEDED
========================= */

const SERVICE_ID = "1"

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