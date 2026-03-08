export default async function handler(req,res){

try{

const response=await fetch("https://dhru.checkimei.com/api/index.php",{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({

username:"WilnoEsteril565",
apiaccesskey:"zPxFG-eANVU-OpN1q-NpwpJ-XptdG-m2DYL",
request:"SERVICE_LIST"

})
})

const data=await response.json()

res.status(200).json(data)

}catch(err){

res.status(500).json({
error:"Service fetch failed"
})

}

}