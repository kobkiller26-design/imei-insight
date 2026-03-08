export default async function handler(req,res){

const {imei,service,apikey}=req.query

const users=[
{key:"client1key2026",credits:100},
{key:"resellerkey500",credits:500}
]

const user=users.find(u=>u.key===apikey)

if(!user){
return res.status(401).json({error:"Invalid API key"})
}

if(user.credits<=0){
return res.status(403).json({error:"No credits remaining"})
}

try{

const params=new URLSearchParams()

params.append("username","YOUR_DHRU_USERNAME")
params.append("apiaccesskey","YOUR_DHRU_API_KEY")
params.append("request","imei")
params.append("imei",imei)

const response=await fetch("https://dhru.checkimei.com/api",{
method:"POST",
body:params
})

const result=await response.text()

user.credits -= 1

res.json({
imei:imei,
result:result,
credits_remaining:user.credits
})

}catch(e){

res.status(500).json({error:"IMEI check failed"})

}

}