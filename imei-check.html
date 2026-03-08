document.addEventListener("DOMContentLoaded", () => {

const checkBtn = document.querySelector("#checkBtn")
const imeiInput = document.querySelector("#imei")
const serviceSelect = document.querySelector("#service")
const resultBox = document.querySelector("#result")

if (!checkBtn) return

checkBtn.addEventListener("click", async () => {

const imei = imeiInput.value.trim()
const service = serviceSelect.value

if (!imei) {
resultBox.textContent = "Enter IMEI"
return
}

resultBox.textContent = "Checking..."

try {

const response = await fetch("/api/api-check", {
method: "POST",
headers: {
"Content-Type": "application/json"
},
body: JSON.stringify({
imei: imei,
service: service
})
})

const data = await response.json()

resultBox.textContent = JSON.stringify(data, null, 2)

} catch (error) {

resultBox.textContent = "Request failed"

}

})

})