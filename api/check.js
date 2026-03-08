import {verifyToken} from "../lib/auth.js"
import {useCredit,addHistory} from "../lib/db.js"

export default async function handler(req,res){

try{

const token = req.headers.authorization

const user = verifyToken(token)

if(!user){
return res.status(401).json({error:"Login required"})
}

if(!useCredit(user.email)){
return res.status(403).json({error:"No credits"})
}

const imei = req.query.imei

if(!imei){
return res.status(400).json({error:"IMEI required"})
}

const params = new URLSearchParams()

params.append("username","YOUR_DHRU_USERNAME")
params.append("apiaccesskey","YOUR_DHRU_API_KEY")
params.append("request","imei")
params.append("imei",imei)

const response = await fetch("https://dhru.checkimei.com/api",{
method:"POST",
body:params
})

const text = await response.text()

let result

try{
result = JSON.parse(text)
}catch{
result = text
}

addHistory({
user:user.email,
imei:imei,
result:result
})

res.status(200).json({
success:true,
result:result
})

}catch(e){

res.status(500).json({
error:"IMEI check failed"
})

}

}