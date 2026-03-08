import {getKey,useCredit} from "../lib/keys.js"

export default async function handler(req,res){

const key=req.query.key

const imei=req.query.imei

const account=getKey(key)

if(!account){
return res.status(403).json({error:"Invalid API key"})
}

if(!useCredit(key)){
return res.status(403).json({error:"No credits"})
}

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

res.json({result:data})

}