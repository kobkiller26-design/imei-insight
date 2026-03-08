async function checkIMEI() {

const imei = document.getElementById("imei").value
const resultBox = document.getElementById("result")

if(!imei){
alert("Enter IMEI")
return
}

resultBox.innerHTML = "Checking IMEI..."

try{

const response = await fetch("/api/check?imei=" + imei)
const data = await response.json()

resultBox.innerHTML = `
<h3>IMEI Result</h3>
<p>${data.result}</p>
`

}catch(error){

resultBox.innerHTML = "Error checking IMEI"

}

}