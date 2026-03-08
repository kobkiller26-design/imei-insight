async function checkIMEI(){

const imei = document.getElementById("imei").value.trim()
const resultBox = document.getElementById("result")

if(imei.length !== 15 || isNaN(imei)){
resultBox.innerHTML = "IMEI must be 15 digits"
return
}

resultBox.innerHTML = "Checking device..."

try{

const response = await fetch("/api/check?imei=" + imei)
const data = await response.json()

resultBox.innerHTML = `
<h3>IMEI Result</h3>
<p>${data.result}</p>
`

}catch(error){

resultBox.innerHTML = "Unable to check IMEI"

}

}
