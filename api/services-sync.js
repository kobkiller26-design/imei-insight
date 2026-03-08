export default async function handler(req,res){

try{

const params = new URLSearchParams()

params.append("username","WilnoEsteril565")
params.append("apiaccesskey","KKNGz-qcQhZ-VTkNe-u2DfL-jy020-vwdZQ")
params.append("request","services")

const response = await fetch("https://dhru.checkimei.com/api",{
method:"POST",
body:params
})

const data = await response.json()

let services = []

// markup settings
const MARKUP_PERCENT = 200
const MIN_PROFIT = 1.50

for(const group in data){

const groupServices = data[group].services

for(const id in groupServices){

const service = groupServices[id]

let cost = parseFloat(service.price)

// calculate markup
let sell = cost + (cost * (MARKUP_PERCENT / 100))

// ensure minimum profit
if(sell < cost + MIN_PROFIT){
sell = cost + MIN_PROFIT
}

// round to 2 decimals
sell = parseFloat(sell.toFixed(2))

services.push({
serviceid: service.serviceid,
servicename: service.servicename,
cost_price: cost,
sell_price: sell
})

}

}

res.status(200).json({
services:services
})

}catch(e){

res.status(500).json({
error:"Service sync failed"
})

}

}