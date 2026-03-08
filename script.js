fasync function checkIMEI() {

const imei = document.getElementById("imei").value

if(!imei){
alert("Enter IMEI")
return
}

const response = await fetch("/api/check?imei=" + imei)
const data = await response.json()

document.getElementById("result").innerText = data.result

}