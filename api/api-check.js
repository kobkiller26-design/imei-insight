export default async function handler(req,res){

if(req.method!=="POST"){
return res.status(405).json({error:"Method not allowed"})
}

try{

const {imei,service}=req.body

if(!imei){
return res.status(400).json({error:"IMEI required"})
}

const response=await fetch("https://dhru.checkimei.com/api/index.php",{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({

username:"WilnoEsteril565",
apiaccesskey:"zPxFG-eANVU-OpN1q-NpwpJ-XptdG-m2DYL",
request:"CHECK_IMEI",
imei:imei,
serviceid:service

})
})

const data=await response.json()

res.status(200).json(data)

}catch(err){

res.status(500).json({
error:"Server error",
details:err.message
})

}

}