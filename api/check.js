import {verifyToken} from "../lib/auth.js"
import {useCredit,addHistory} from "../lib/db.js"

export default async function handler(req,res){

const token=req.headers.authorization

const user=verifyToken(token)

if(!user){
return res.status(401).json({error:"Login required"})
}

if(!useCredit(user.email)){
return res.status(403).json({error:"No credits"})
}

const imei=req.query.imei

const params=new URLSearchParams()

params.append("username","YOUR_DHRU_USERNAME")
params.append("apiaccesskey","YOUR_DHRU_API_KEY")
params.append("request","imei")
params.append("imei",imei)

const response=await fetch("https://dhru.checkimei.com/api/index.php",{
method:"POST",
body:params
})

const data=await response.text()

addHistory({
user:user.email,
imei,
result:data
})

res.json({result:data})

}