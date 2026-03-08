async function pay(){

const r=await fetch("/api/create-checkout")

const data=await r.json()

window.location=data.url

}

async function checkIMEI(){

const imei=document.getElementById("imei").value

const token=localStorage.getItem("token")

const res=await fetch("/api/check?imei="+imei,{
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