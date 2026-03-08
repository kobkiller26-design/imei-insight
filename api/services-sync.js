export default async function handler(req,res){

const params=new URLSearchParams()

params.append("username","YOUR_DHRU_USERNAME")
params.append("apiaccesskey","YOUR_DHRU_API_KEY")
params.append("request","imeiservice")

const response=await fetch("https://dhru.checkimei.com/api/index.php",{
method:"POST",
body:params
})

const data=await response.text()

res.json({
services:data
})

}