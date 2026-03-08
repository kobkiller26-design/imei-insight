async function checkIMEI(){

const imei = document.getElementById("imei").value.trim()
const result = document.getElementById("result")

if(imei.length !== 15 || isNaN(imei)){
result.innerHTML="IMEI must be 15 digits"
return
}

result.innerHTML="Checking IMEI..."

try{

const response = await fetch("/api/check?imei=" + imei)
const data = await response.json()

result.innerHTML=`
<b>IMEI:</b> ${imei}<br><br>
${data.result}
`

}catch(e){

result.innerHTML="Error checking device"

}

}
