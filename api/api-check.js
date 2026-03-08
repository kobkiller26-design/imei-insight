export default async function handler(req, res){

const { imei, service, apikey } = req.query

// simple API key list (you can move this to database later)
const users = [
{key:"API_KEY_123", credits:100},
{key:"API_KEY_456", credits:50}
]

const user = users.find(u=>u.key===apikey)

if(!user){
return res.json({error:"Invalid API key"})
}

if(user.credits <= 0){
return res.json({error:"No credits"})
}

try{

const dhru = await fetch("https://YOUR-DHRU-URL/api",{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({
imei:imei,
service:service
})
})

const result = await dhru.json()

user.credits -= 1

res.json({
imei:imei,
result:result,
credits_remaining:user.credits
})

}catch(e){

res.json({error:"IMEI check failed"})

}

}