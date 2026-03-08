export default async function handler(req, res) {

const params = new URLSearchParams()

params.append("username","WilnoEsteril565")
params.append("apiaccesskey","YOUR_API_KEY")
params.append("request","imeiservice")

let response = await fetch("https://dhru.checkimei.com/api/index.php",{
method:"POST",
body:params
})

let data = await response.text()

res.status(200).json({services:data})

}