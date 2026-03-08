export default async function handler(req, res) {

const { imei } = req.query

const params = new URLSearchParams()

params.append("username","WilnoEsteril565")
params.append("apiaccesskey","KKNGz-qcQhZ-VTkNe-u2DfL-jy020-vwdZQ")
params.append("request","imei")
params.append("imei", imei)

const response = await fetch("https://dhru.checkimei.com/api/index.php",{
method:"POST",
body:params
})

const data = await response.text()

res.status(200).json({result:data})

}