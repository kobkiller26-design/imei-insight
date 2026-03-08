export default async function handler(req, res) {

const { imei, service } = req.body

try {

const response = await fetch("https://api.imei-server.com/v1/dhruFusion.php", {

method: "POST",

headers: {
"Content-Type": "application/json"
},

body: JSON.stringify({

username: "WilnoEsteril565",
apiaccesskey: "zPxFG-eANVU-OpN1q-NpwpJ-XptdG-m2DYL",

request: "CHECK_IMEI",

imei: imei,

serviceid: service

})

})

const data = await response.json()

res.status(200).json(data)

} catch (error) {

res.status(500).json({
error: "API request failed"
})

}

}