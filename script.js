async function pay(){

const r=await fetch("/api/create-checkout")

const data=await r.json()

window.location=data.url

}

async function checkIMEI(){

const imei=document.getElementById("imei").value

const token=localStorage.getItem("token")

const service=document.getElementById("service").value

const res=await fetch("/api/check?imei="+imei+"&service="+service,{
headers:{
authorization:token
}
})

const data=await res.json()

document.getElementById("result").innerHTML=data.result

}

async function login(){

const email=document.getElementById("email").value
const password=document.getElementById("password").value

const res=await fetch("/api/login",{
method:"POST",
headers:{"Content-Type":"application/json"},
body:JSON.stringify({email,password})
})

const data=await res.json()

localStorage.setItem("token",data.token)

}

async function loadServices(){

const res=await fetch("/api/services-sync")

const data=await res.json()

const select=document.getElementById("service")

if(!select) return

select.innerHTML=""

try{

const services=JSON.parse(data.services)

services.forEach(s=>{

let option=document.createElement("option")

option.value=s.serviceid

option.text=s.servicename+" - $"+s.price

select.appendChild(option)

})

}catch{

select.innerHTML="<option>Services loading failed</option>"

}

}

loadServices()